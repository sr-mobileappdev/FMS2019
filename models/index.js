
export class AsyncState {
    constructor(status, value, error) {
        this.status = status || 'NEW';
        this.value = value || null;
        this.error = error || null;
    }

    isNew = () => this.status === 'NEW'
    isInProgress = () => this.status === 'IN_PROGRESS'
    isSuccessful = () => this.status === 'SUCCESS'
    isNetworkProblems = () => this.status === 'NETWORK_PROBLEMS'
    isComplete = () => !this.isNew() && !this.isInProgress()
    isFailed = () => this.isComplete() && !this.isSuccessful()
    isUseless = () => this.isNew() || this.isFailed()
}