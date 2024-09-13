// 動画要素、結果表示部分、ボタンの取得
const video = document.getElementById('qr-video');
const resultDisplay = document.getElementById('qr-result');
const startButton = document.getElementById('start-button');
let qrScanner; // QRスキャナー用の変数

// MutationObserverで結果の変化を監視
const observerConfig = { childList: true }; // 監視するのは子ノードの変更のみ
const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('QR結果が変更されました:', resultDisplay.textContent);
        }
    }
};

// MutationObserverを初期化して監視を開始
const resultObserver = new MutationObserver(callback);
resultObserver.observe(resultDisplay, observerConfig);

// スキャンボタンがクリックされたときの処理
startButton.addEventListener('click', () => {
    // 担当者名と貸出/返却の値を取得
    const userName = document.getElementById('userName').value;
    const actionType = document.querySelector('input[name="actionType"]:checked').value;

    // 担当者名が入力されていない場合は警告
    if (!userName) {
        alert('担当者名を入力してください');
        return;
    }

    // QRスキャナーの初期化
    qrScanner = new QrScanner(video, result => {
        // QRコードの読み取りが完了したらスキャナーを停止
        qrScanner.stop(); 

        // スキャン結果を表示（result.data から取得）
        resultDisplay.textContent = '結果: ' + result.data;

        // QRコードの情報、担当者名、貸出/返却をGoogle Apps Script APIに送信
        fetch('<<Google Apps ScriptのウェブアプリURL>>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                qrCode: result.data, // スキャン結果を送信
                userName: userName,  // 担当者名
                actionType: actionType // 貸出/返却
            })
        })
        .then(response => response.text())
        .then(data => {
            alert('データが保存されました: ' + data);
        })
        .catch(error => {
            console.error('エラー:', error);
        });
    }, {
        returnDetailedScanResult: true, // 新しいAPIを使用して詳細なスキャン結果を取得
        onDecodeError: error => {
            console.error('QRコードの読み取りに失敗しました:', error);
        }
    });

    // スキャナーを開始
    qrScanner.start().catch(error => {
        console.error('ビデオの再生に失敗しました:', error);
    });
});
