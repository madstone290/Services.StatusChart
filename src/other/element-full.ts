/**
 * 특정 엘리먼트를 지정한 컨테이너 엘리먼트에 가득 차도록 한다.
 */
class ElementFull {
    /**
     * 컨테이너 엘리먼트
     */
    _container: HTMLElement;

    /**
     * 대상 엘리먼트의 부모 엘리먼트. 가득찬 상태에서 원래 위치로 복귀할 때 사용한다.
     */
    _parent: HTMLElement;

    /**
     * 대상 엘리먼트의 다음 엘리먼트. 가득찬 상태에서 원래 위치로 복귀할 때 사용한다.
     */
    _reference: HTMLElement;

    /**
     * 가득찬 상태인지 여부
     */
    _isFull = false;

    constructor(container: HTMLElement) {
        this._container = container;
    }

    toggle = (element: HTMLElement) => {
        if (!this._isFull) {
            this._parent = element.parentElement;
            this._reference = element.nextElementSibling as HTMLElement;

            for (const child of this._container.children) {
                (child as HTMLElement).style.display = "none";
            }

            this._container.appendChild(element);
            element.style.width = "100%";
            element.style.height = "100%";
            this._isFull = true;
        } else {
            element.style.width = null;
            element.style.height = null;
            this._container.removeChild(element);
            
            this._parent.insertBefore(element, this._reference);
            for (const child of this._container.children) {
                (child as HTMLElement).style.display = null;
            }
            this._isFull = false;
        }
    }
}