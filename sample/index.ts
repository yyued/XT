/// <reference path="../src/xt.d.ts" />

// declare const FOOPlugin: any

class AppDelegate extends XT.ApplicationDelegate {

    applicationDidFinishLaunchingWithOptions() {
        this.window = new XT.Window();
        this.window.rootViewController = new XT.NavigationController(new FirstViewController())
        this.window.makeKeyAndVisible();
    }

}

class FirstListCell extends XT.ListCell {

    owner?: FirstViewController
    myLabel: XT.Label = new XT.Label(XT.RectMake(0.0, 0.0, 300, 200))
    // myFoo: XT.CustomView = new XT.CustomView("FOOView", XT.RectMake(300, 0, 75, 44))

    init() {
        super.init();
        this.myLabel.lineBreakMode = XT.LineBreakMode.TruncatingTail
        this.myLabel.numberOfLines = 0
        this.myLabel.lineSpace = 10
        // this.myLabel.font = XT.Font.systemFontOfSize(24)
        // this.myLabel.letterSpace = 5
        // this.myLabel.textAlignment = XT.TextAlignment.Right

        // const redView = new XT.View(XT.RectMake(0, 0, 22, 22))
        // redView.backgroundColor = XT.Color.redColor
        // redView.alpha = Math.random()
        // this.contentView.addSubview(redView)
        this.contentView.addSubview(this.myLabel)
        // this.myFoo.userInteractionEnabled = true
        // this.myFoo.onTap = () => {
        //     this.myFoo.props = {
        //         on: !this.myFoo.props.on
        //     }
        // }
        // this.contentView.addSubview(this.myFoo)
        this.contentView.userInteractionEnabled = true
    }

    didSelected() {
        if (this.owner && this.owner.navigationController) {
            this.owner.navigationController.pushViewController(new SecondViewController())
        }
    }

}

class FirstItem implements XT.ListItem {

    [key: string]: any;
    reuseIdentifier: string = "Cell"
    rowHeight: (width: number) => number = () => {
        return 200
    }
    name: string = "Pony"

    constructor(name: string) {
        this.name = name;
    }

}

class FirstViewController extends XT.ViewController {

    title = "First"
    // private fooView: XT.ListView;

    viewDidLoad() {

        const ctx = new XT.CanvasView(XT.RectMake(0.0, 0.0, 300.0, 300.0))
        ctx.fillStyle=XT.Color.yellowColor;
        ctx.rect(0,0,250,100)
        ctx.fill()
        
        ctx.setTransform(1,0.5,-0.5,1,30,10);
        ctx.fillStyle=XT.Color.redColor;
        ctx.rect(0,0,250,100);
        ctx.fill()
        
        ctx.setTransform(1,0.5,-0.5,1,30,10);
        ctx.fillStyle=XT.Color.blueColor;
        ctx.fillRect(0,0,250,100);
        this.view.addSubview(ctx);

        setTimeout(() => {
            ctx.clear();
            ctx.fillStyle = XT.Color.orangeColor
            ctx.fillRect(44,44,44,44)
        }, 1000)

        // const fooView = new XT.ListView(XT.RectMake(0.0, 0.0, 0.0, 0.0))
        // this.fooView = fooView
        // fooView.register(FirstListCell, "Cell")
        // fooView.renderItem = (cell: FirstListCell, item: FirstItem) => {
        //     XT.TextMeasurer.measureText("123123123213123fdsfdsahlf", {numberOfLines: 0, font: XT.Font.systemFontOfSize(14), inRect: {x: 0, y: 0, width: 100, height: 244}})
        //     cell.owner = this
        //     cell.myLabel.text = item.name
        // }
        // let items = []
        // for (var index = 0; index < 100; index++) {
        //     items.push(new FirstItem("Index >>> " + index + " Hello, World!" + (new Date()).toString()))
        // }
        // fooView.items = items
        // fooView.reloadData()
        // this.view.addSubview(fooView);
    }

    viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews();
        // this.fooView.frame = this.view.bounds
    }

}

class SecondViewController extends XT.ViewController {

    title = "Second"

    viewDidLoad() {
        // const fooView = new XT.CustomView("FOOView", XT.RectMake(44, 44, 200, 88))
        // fooView.userInteractionEnabled = true;
        // fooView.onTap = () => {
        //     fooView.props = {
        //         on: !fooView.props.on
        //     }
        // }
        // this.view.addSubview(fooView)
        const redView = new XT.View(XT.RectMake(88, 44, 88, 88))
        redView.alpha = 0.5
        redView.userInteractionEnabled = true
        redView.backgroundColor = XT.Color.redColor
        redView.onTap = () => {
            redView.alpha = 0.0
        }
        this.view.addSubview(redView)
    }

}

const application = new XT.Application('app', new AppDelegate());