import { TransformMatrix } from "../../../interface/TransformMatrix";

export interface CoordinateOwner {

    transform?: { a: number, b: number, c: number, d: number, tx: number, ty: number }
    frame: { x: number, y: number, width: number, height: number }
    superview: CoordinateOwner | undefined
    subviews: CoordinateOwner[]

}

export function isPointInside(point: { x: number, y: number }, owner: CoordinateOwner) {
    return point.x >= 0.0 && point.x <= owner.frame.width && point.y >= 0.0 && point.y <= owner.frame.height
}

export function convertPointToChildView(point: { x: number, y: number }, parent: CoordinateOwner, child: CoordinateOwner): { x: number, y: number } {
    let stack = [child];
    let current = child;
    while (current.superview) {
        stack.unshift(current.superview);
        current = current.superview
        if (current == parent) {
            break;
        }
    }
    if (stack.indexOf(parent) < 0) {
        return point
    }
    else {
        let curPoint = { x: point.x, y: point.y }
        stack.forEach(nextView => {
            const transform = nextView.transform;
            const frame = nextView.frame;
            if (transform && !TransformMatrix.isIdentity(transform)) {
                if (transform.a == 0.0 || transform.d == 0.0) {
                    let unmatrix = TransformMatrix.unmatrix(transform)
                    let newMatrix = TransformMatrix.postTranslate(new TransformMatrix(), -frame.width / 2.0, -frame.height / 2.0)
                    newMatrix = TransformMatrix.postRotate(newMatrix, unmatrix.degree * Math.PI / 180.0);
                    newMatrix = TransformMatrix.postScale(newMatrix, unmatrix.scale.x, unmatrix.scale.y)
                    newMatrix = TransformMatrix.postTranslate(newMatrix, unmatrix.translate.x, unmatrix.translate.y)
                    newMatrix = TransformMatrix.postTranslate(newMatrix, frame.width / 2.0, frame.height / 2.0)
                    let m = point.x - frame.x - newMatrix.tx;
                    let n = point.y - frame.y - newMatrix.ty;
                    let x = -((newMatrix.d * n / newMatrix.c) - m) / ((newMatrix.a * newMatrix.d / newMatrix.c) - newMatrix.b)
                    let y = -(n - newMatrix.a * m / newMatrix.b) / (newMatrix.c - newMatrix.d * newMatrix.a / newMatrix.b)
                    curPoint = { x: x, y: y }
                }
                else {
                    let unmatrix = TransformMatrix.unmatrix(transform)
                    let newMatrix = TransformMatrix.postTranslate(new TransformMatrix(), -frame.width / 2.0, -frame.height / 2.0)
                    newMatrix = TransformMatrix.postRotate(newMatrix, unmatrix.degree * Math.PI / 180.0);
                    newMatrix = TransformMatrix.postScale(newMatrix, unmatrix.scale.x, unmatrix.scale.y)
                    newMatrix = TransformMatrix.postTranslate(newMatrix, unmatrix.translate.x, unmatrix.translate.y)
                    newMatrix = TransformMatrix.postTranslate(newMatrix, frame.width / 2.0, frame.height / 2.0)
                    let m = point.x - frame.x - newMatrix.tx;
                    let n = point.y - frame.y - newMatrix.ty;
                    let x = (n - m * newMatrix.c / newMatrix.d) / (newMatrix.a - newMatrix.b * newMatrix.c / newMatrix.a)
                    let y = -(m - n * newMatrix.b / newMatrix.a) / (newMatrix.d - newMatrix.c * newMatrix.b / newMatrix.d)
                    curPoint = { x: x, y: y }
                }
            }
            else {
                curPoint = { x: curPoint.x - frame.x, y: curPoint.y - frame.y }
            }
        })
        return curPoint
    }
}