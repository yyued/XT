/// <reference path="../src/xt.d.ts" />
/// <reference path="./xtml/sayHello.d.ts" />
import SayHello from "./xtml/sayHello.xtml"

// declare const FOOPlugin: any

// if (XT.CustomViewFactory) {
//     XT.CustomViewFactory.register("FOO", class _ extends XT.CustomViewFactory {

//             requestInnerHTML() {
//                 return '<video src="http://www.sample-videos.com/video/mp4/360/big_buck_bunny_360p_1mb.mp4" style="width: 100%; height: 100%; display: block; background-color: black" playsinline></video>'
//             }

//             _props: any;

//             requestProps() {
//                 return this._props || {
//                     play: false
//                 };
//             }

//             setProps(node: HTMLVideoElement, value) {
//                 this._props = value
//                 if (value.play === true) {
//                     node.play()
//                 }
//                 else if (value.play === false) {
//                     node.pause()
//                 }
//             }

//             handleMessage(node, message) {
//                 console.log(message)
//             }

//         })
// }

class AppDelegate extends XT.ApplicationDelegate {

    applicationDidFinishLaunchingWithOptions() {
        // const view = new XT.View();
        // view.backgroundColor = XT.Color.redColor
        this.window = new XT.Window();
        this.window.rootViewController = new XT.NavigationController(new FirstViewController())
        this.window.makeKeyAndVisible();
        // setTimeout(() => {
        //     XT.Application.sharedApplication().exit();
        // })
    }

}

class FirstViewController extends XT.ViewController {

    title = "First"

    viewDidLoad() {
        const view = new SayHello();
        view.frame = XT.RectMake(0, 0, 300, 300);
        // view.fooView.addConstraints(XT.LayoutConstraint.constraintsWithVisualFormat("[barView(200)]", {barView: view.barView}))
        // view.barView.addConstraint(new XT.LayoutConstraint(undefined, undefined, XT.LayoutRelation.Equal, view.barView, XT.LayoutAttribute.Width, 200))
        // view.fooView.addConstraint(new XT.LayoutConstraint(view.fooView, XT.LayoutAttribute.CenterX, XT.LayoutRelation.Equal, view.barView, XT.LayoutAttribute.CenterX))
        // view.fooView.addConstraints(XT.LayoutConstraint.constraintsWithVisualFormat("H:|~[barView]~|", {fooView: view.fooView, barView: view.barView}))
        // view.fooView.layoutIfNeeded()
        // view.barView.layoutIfNeeded()
        // view.addConstraints(XT.LayoutConstraint.constraintsWithVisualFormat("|-0-[view]-0-|", {view: view.barView}))
        // view.addConstraints(XT.LayoutConstraint.constraintsWithVisualFormat("V:|-0-[view]-0-|", {view: view.barView}))
        // view.barView.backgroundColor = XT.Color.greenColor
        // view.barButton.onTouchUpInside = () => {
        //     console.log("12313123132")
        // }
        // view.barView.clipsToBounds = true
        // view.fooView.backgroundColor = XT.Color.greenColor
        this.view.addSubview(view);
        // const view = new XT.ImageView(XT.RectMake(44, 44, 78, 78))
        // view.userInteractionEnabled = true;
        // view.onTap = () => {
        //     this.navigationController && this.navigationController.pushViewController(new SecondViewController())
        // }
        // XT.Image.fromAssetsWithScales("success", 2, (it) => {
        //     view.image = it
        // })
        // view.backgroundColor = XT.Color.yellowColor
        // this.view.addSubview(view)
    }

}

class SecondViewController extends XT.ViewController {

    title = "Second"
    sm = new XT.View().addOwner(this)

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
        // redView.alpha = 0.5
        // redView.userInteractionEnabled = true
        redView.backgroundColor = XT.Color.redColor
        // redView.onTap = () => {
        //     redView.alpha = 0.0
        // }
        this.view.addSubview(redView)
    }

}

const sampleApplication = new XT.Application('app', new AppDelegate());
