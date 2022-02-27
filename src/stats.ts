export class Stats {
    success = 0;
    error = 0;
    loop = 0;
    target: string;

    get isRun() {
        return !!this.target;
    }

    reset() {
        this.success = 0;
        this.error = 0;
        this.loop = 0;
        this.target = null;
    }
}