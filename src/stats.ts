export class Stats {
    success = 0;
    errors = 0;
    loop = 0;
    target: string;

    get isRun() {
        return !!this.target;
    }

    reset() {
        this.success = 0;
        this.errors = 0;
        this.loop = 0;
        this.target = null;
    }
}