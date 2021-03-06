/// <reference path="../../xt.d.ts" />

export class WebViewSample extends UI.ViewController {

    contentView = new UI.View()
    webView = new UI.WebView()

    viewDidLoad() {
        super.viewDidLoad()
        this.navigationBar.backgroundColor = new UI.Color(0xf6 / 0xff, 0xf6 / 0xff, 0xf6 / 0xff)
        this.title = "WebView"
        this.showNavigationBar()
        this.view.backgroundColor = new UI.Color(0xf6 / 0xff, 0xf6 / 0xff, 0xf6 / 0xff)
        this.view.addSubview(this.contentView)
        this.addTestCases()
    }

    viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        this.contentView.frame = this.view.bounds
        this.webView.frame = this.contentView.bounds
    }

    addTestCases() {
        this.contentView.addSubview(this.webView)
        this.webView.load("https://www.gz.gov.cn/")
        this.webView.onStart = () => {
            this.title = "Loading..."
        }
        this.webView.onFinish = () => {
            this.title = "中国广州政府"
        }
        this.webView.onFail = () => {
            this.title = "加载失败...."
        }
    }

}