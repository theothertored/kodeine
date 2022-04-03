class Greeter {
    private element: HTMLElement;
    private span: HTMLElement;
    private timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement("span");
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    public start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    public stop() {
        clearTimeout(this.timerToken);
    }
}

window.onload = () => {
    const el = document.getElementById("content");
    const greeter = new Greeter(el);
    greeter.start();
};
