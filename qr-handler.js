// ローカルにホスティングしているqr-scanner-worker.min.jsのパスを指定
QrScanner.WORKER_PATH = './qr-scanner-worker.min.js';

// 動画要素、結果表示部分、ボタンの取得
const video = document.getElementById('qr-video');
const resultDisplay = document.getElementById('qr-result');
const startButton = document.getElementById('start-button');
let qrScanner; // QRスキャナー用の変数

// スキャンボタンがクリックされたときの処理
startButton.addEventListener('click', () => {
    const userName = document.getElementById('userName').value;
    const actionType = document.querySelector('input[name="actionType"]:checked').value;

    if (!userName) {
        alert('担当者名を入力してください');
        return;
    }

    // QRスキャナーの初期化
    qrScanner = new QrScanner(video, result => {
        qrScanner.stop(); 
        resultDisplay.textContent = '結果: ' + result.data;

        // QRコードの情報、担当者名、貸出/返却をGoogle Apps Script APIに送信
        fetch('<<Google Apps ScriptのウェブアプリURL>>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                qrCode: result.data,
                userName: userName,
                actionType: actionType
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
        returnDetailedScanResult: true,
        onDecodeError: error => {
            console.error('QRコードの読み取りに失敗しました:', error);
        }
    });

    qrScanner.start().catch(error => {
        console.error('ビデオの再生に失敗しました:', error);
    });
});
