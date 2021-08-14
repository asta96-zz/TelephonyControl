import { IInputs, IOutputs } from "../generated/ManifestTypes";


interface PageParameterable {
    phonenumber?: string,
    toid?: string,
    toidname?: string,
    toidtype?: string
}

interface entityReference {
    id: string,
    name: string,
    entityType: string
}

export class inputComponent {
    //  public inputValue: HTMLInputElement = document.createElement('input');
    private that: object;
    private imgElement: HTMLImageElement;
    private inputElement: HTMLInputElement;
    constructor(private context: ComponentFramework.Context<IInputs>, private notifyOutputChanged: () => void) {
        // this.inputValue.innerText = context.parameters.phoneField.raw!;
        this.that = this;
    }
    instanstiate(): HTMLDivElement {
        const container = document.createElement('div');
        container.id = 'input_container';
        this.inputElement = document.createElement('input');
        this.inputElement.id = 'phoneInput';
        this.inputElement.type = 'text';
        this.inputElement.placeholder = 'enter phone number here..!';
        this.inputElement.value = this.context.parameters.phoneField.raw!.toString();
        //inputElement.addEventListener('input', this.inputChangeHandler.bind(this));
        this.imgElement = document.createElement('img');
        this.imgElement.id = 'input_img';
        this.context.resources.getResource('img/Phone_icon.png',
            this.setPdfImage.bind(this), this.showError.bind(this, "ERROR with PDF Image!"));
        // this.imgElement.addEventListener('click', this.phoneClickHandler.bind(this));
        container.appendChild(this.inputElement);
        container.appendChild(this.imgElement);
        // this.imgElement.removeEventListener('click', this.phoneClickHandler);
        return container;
    }

    public addOrRemoveHandler(type: 'add' | 'remove', elementId: string, eventName: string, handler: Function): void {
        let element: HTMLElement;
        switch (type) {
            case 'add': {
                element = document.getElementById(elementId) as HTMLElement;
                element.addEventListener(eventName, handler.bind(this.that))
                break;
            }
            case 'remove': {
                debugger;
                element = document.getElementById(elementId) as HTMLElement;
                element.removeEventListener(eventName, handler.bind(this.that));
                break;
            }
        }

    }
    private setPdfImage(body: string) {
        this.imgElement.src = this.generateImageSrcUrl('image/png', body);
    }
    private generateImageSrcUrl(fileType: string, fileContent: string): string {
        return "data:" + fileType + ";base64, " + fileContent;
    }
    public inputChangeHandler(event: Event): void {
        this.notifyOutputChanged();
    }

    private showError(text: string) {
        console.error("ERROR:", text);
    }
    public async phoneClickHandler(event: Event): Promise<void> {
        event.preventDefault();
        await this.OpenFormDialogue();
        this.notifyOutputChanged();
    }

    private async OpenFormDialogue() {
        let _params: PageParameterable = await this.getData();
        let formParameters = {
            phonenumber: _params.phonenumber,
            toid: _params.toid,
            toidname: _params.toidname,
            toidtype: _params.toidtype
        };

        //alert("Hello");

        var entityFormOptions = {
            entityName: "phonecall",
            useQuickCreateForm: true
        }
        console.log(entityFormOptions, formParameters);
        Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
            function (success) {
                console.log(success);
            },
            function (error) {
                console.log(error);
            });

    }

    private async getData(): Promise<PageParameterable> {
        let response: PageParameterable = {}
        const { etn, id } = this.getPageParameters();
        const _result = await Xrm.WebApi.retrieveRecord(etn, id, "?$select=name");
        response = {
            phonenumber: this.context.parameters.phoneField.raw!.toString(),
            toidtype: etn,
            toid: id,
            toidname: _result?.name ?? ""
        }
        return response;
    }


    private getPageParameters(): any {
        //get current page url
        const url = window.location.href;
        //get the part after question mark with parameters list
        const parametersString = url.split("?")[1];
        let parametersObj: any = {};
        if (parametersString) {
            // split string to pair parameter=value
            for (let paramPairStr of parametersString.split("&")) {
                let paramPair = paramPairStr.split("=");
                parametersObj[paramPair[0]] = paramPair[1];
            }
        }
        //as a result you will have something like this
        // {
        //     appid: f22d7a50-53fa-42c7-93d3-fd2526e23055,
        //     pagetype: entityrecord,
        //     etn: contact,
        //     id: 77ffee28-1e8f-453f-8d51-493442bbb327
        // }
        return parametersObj;
    }


}
export interface IinputComponent {
    instanstiate(): HTMLDivElement;
    addOrRemoveHandler(type: 'add' | 'remove', elementId: string, eventName: string, handler: Function): void;
    inputChangeHandler(event: Event): void;
    phoneClickHandler(event: Event): Promise<void>;
}
