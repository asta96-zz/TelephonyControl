import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { inputComponent, IinputComponent } from "./Modal/inputComponent";
export class TelephonyControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	/**
	 * Empty constructor.
	 */
	private _container: HTMLDivElement;
	private inpContainer: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	//private _notifyOutputChanged: () => void;
	private _outValue: HTMLInputElement;
	private _component: IinputComponent;

	constructor() {

	}


	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
		this._container = container;
		//this._notifyOutputChanged = notifyOutputChanged;
		this._context = context;
		this._component = new inputComponent(context, notifyOutputChanged);
		const input: HTMLDivElement = this._component.instanstiate();
		this._container.appendChild(input);
		this._component.addOrRemoveHandler('add', 'phoneInput', 'input', this._component.inputChangeHandler);
		this._component.addOrRemoveHandler('add', 'input_img', 'click', this._component.phoneClickHandler);
	}



	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this._outValue = document.getElementById('phoneInput') as HTMLInputElement;
	}

	public getOutputs(): IOutputs {

		return {
			phoneField: this._outValue.value.toString()
		};
	}


	public destroy(): void {
		this._component.addOrRemoveHandler('remove', 'phoneInput', 'input', this._component.inputChangeHandler);
		this._component.addOrRemoveHandler('remove', 'input_img', 'click', this._component.phoneClickHandler);

	}
}
