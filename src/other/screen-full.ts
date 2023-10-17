/**
 * 스크린에 가득차도록 한다.
 */
class ScreenFull {
    _isFull = false;

    toggle = (element: HTMLElement) => {

            if (!this._isFull) {
                element.requestFullscreen();
                this._isFull = true;
            } else {
                document.exitFullscreen();
                this._isFull = false;
            }
   
    }
}