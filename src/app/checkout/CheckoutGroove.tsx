import React from "react";
import DatePicker from "react-datepicker";
import CheckoutStepType from "./CheckoutStepType";
import { Button, ButtonVariant } from "../ui/button";
import { Modal } from "../ui/modal"
import DynamicFormFieldType from '../ui/form/DynamicFormFieldType';
import DynamicInput from "../ui/form/DynamicInput";

import { createCheckoutService } from '@bigcommerce/checkout-sdk';

// functions, methods, components, notes, etc...

/**
    // ^ Checkout.tsx

    import { GrooveModal, GrooveCheckout, grooveCompletedStep, grooveCheckoutValues, grooveDidUpdate, grooveSnapshot, ReConnectElement } from "./CheckoutGroove"

    export interface CheckoutState {
        activeStepType?: CheckoutStepType;
        isBillingSameAsShipping: boolean;
        customerViewType?: CustomerViewType;
        defaultStepType?: CheckoutStepType;
        error?: Error;
        flashMessages?: FlashMessage[];
        isMultiShippingMode: boolean;
        isCartEmpty: boolean;
        isRedirecting: boolean;
        hasSelectedShippingOptions: boolean;
        grooveCheckout: GrooveCheckout;
    }
    // @ Checkout component

    state: CheckoutState = {
        isBillingSameAsShipping: true,
        isCartEmpty: false,
        isRedirecting: false,
        isMultiShippingMode: false,
        hasSelectedShippingOptions: false,
        grooveCheckout: {...grooveCheckoutValues},
    };

    // @ Checkout component lifecycle methods
   
    async getSnapshotBeforeUpdate(_: any, __:any): Promise<any> {
        const snapshot:grooveSnapshot = { updateCustomShipping: false };
        switch (this.state.activeStepType) {
            case CheckoutStepType.Shipping:
                snapshot.updateCustomShipping = true;
                setTimeout(() => {                    
                    // timeout prevents 'broken button'; on first render
                    ReConnectElement({
                        id: "groove-custom-shipping-btn",
                        tagName: "button", 
                        onclick: ()=> this.setGrooveState({ shipDate: undefined, showCalendar: true, message: undefined })
                    });
                    ReConnectElement({
                        id: "groove-custom-message-p",
                        tagName: "p",
                        innerHTML: this.state.grooveCheckout.message || "please select a shipping day before continuing"                            
                    });
                }, 1);
                break;
            default:
                snapshot.updateCustomShipping = false;
                break;
        }
        return snapshot;
    }

    async componentDidUpdate(prevProps: any, prevState: any, snapshot: Promise<grooveSnapshot>) {
        grooveDidUpdate({
            snapshot,
            previous: { props: prevProps, state: prevState },
            current: { props: this.props, state: this.state }
        });
    }


    // @ Checkout component private method

    private renderStep(step: CheckoutStepStatus): ReactNode {
        switch (step.type) {
        case CheckoutStepType.Customer:
            return this.renderCustomerStep(step);

        case CheckoutStepType.Shipping:
            return this.renderShippingStep(step);

        case CheckoutStepType.Billing:
            if (!grooveCompletedStep(CheckoutStepType.Shipping, this.props, this.state.grooveCheckout)) {
                this.navigateToStep(CheckoutStepType.Shipping);
            }
            return this.renderBillingStep(step);

        case CheckoutStepType.Payment:
            if (!grooveCompletedStep(CheckoutStepType.Shipping, this.props, this.state.grooveCheckout)) {
                this.navigateToStep(CheckoutStepType.Shipping);
            }
            return this.renderPaymentStep(step);

        default:
            return null;
        }
    }    


    // @ "private renderShippingStep", return 

                <LazyContainer>
                    <Shipping
                        cartHasChanged={ hasCartChanged }
                        isBillingSameAsShipping={ isBillingSameAsShipping }
                        isMultiShippingMode={ isMultiShippingMode }
                        navigateNextStep={ this.handleShippingNextStep }
                        onCreateAccount={ this.handleShippingCreateAccount }
                        onReady={ this.handleReady }
                        onSignIn={ this.handleShippingSignIn }
                        onToggleMultiShipping={ this.handleToggleMultiShipping }
                        onUnhandledError={ this.handleUnhandledError }
                        grooveCheckout={this.state.grooveCheckout} />

                <GrooveModal
                    checkoutState={this.state}
                    checkoutProps={this.props}
                    onChange={(shipDate: Date) => this.setGrooveState({ shipDate, showCalendar: false, message: `selected ${shipDate}` })} />

                </LazyContainer>

    // method to set state

        setGrooveState(grooveState:Partial<GrooveCheckout>) {
        this.setState({ grooveCheckout: {
            ...this.state.grooveCheckout,
            ...grooveState
        }});
    }

*/

/**
    // ^ ShippingFormFooter.tsx

import { grooveShowCalendar, GrooveCalendarButton } from '../checkout/CheckoutGroove';

    // ADD consignments to ShippingFormFooterProps ***

export interface ShippingFormFooterProps {
    consignments: any[];   
    cartHasChanged: boolean;
    isMultiShippingMode: boolean;
    shouldShowOrderComments: boolean;
    shouldShowShippingOptions?: boolean;
    shouldDisableSubmit: boolean;
    isLoading: boolean;
}
    // @ ShippingFormFooter PureComponent,


        render(): ReactNode {
        const {
            cartHasChanged,
            isMultiShippingMode,
            shouldShowOrderComments,
            shouldShowShippingOptions = true,
            shouldDisableSubmit,
            isLoading,
            consignments, // deconstruct consignments from props  ***
        } = this.props;

    
    // & conditionally show the "shipping options" Modal button

            { grooveShowCalendar(consignments) && <GrooveCalendarButton /> }


*/

/**
 
    // ^ Shipping.tsx
export interface ShippingProps {
    ...
    grooveCheckout: any; // ADD grooveCheckout to ShippingProps ***
}
*/

/**
    // ^ SingleShippingForm.tsx, MultiShippingForm.tsx

        <ShippingFormFooter
            consignments={ consignments } // pass consignments to ShippingFormFooter !!!
            ...
                />
*/

interface GrooveCheckout {
    showCalendar: boolean;
    shipDate: Date | undefined;
    message: string | undefined;
}

const grooveCheckoutValues = {
    showCalendar: false,
    shipDate: undefined,
    message: undefined,
};

interface onclickFunction {
    (e: any): void;
}

interface ReConnectOptions {
    id: string | undefined;
    className: string | undefined;
    onclick: onclickFunction | undefined;
    selector: string | undefined;
    tagName: keyof HTMLElementTagNameMap;
    innerHTML: string | undefined;
    onChange: any;
    selected: any;
    contentLabel: string;
    minDate: Date;
    maxDate: Date;
}

/**
 * call from getSnapshotBeforeUpdate to update any HTML Element before final render
 *
 * @param options element options
 * @returns void
 */
const ReConnectElement = (options: Partial<ReConnectOptions>) => {
    let element = options.selector
        ? document.querySelector(options.selector)
        : document.querySelector(`#${options.id}`);
    if (!element || !options.tagName) return;
    // console.log(options)
    let newElement = document.createElement(options.tagName);
    newElement.className = options.className || element.className;
    newElement.innerHTML = options.innerHTML || element.innerHTML;
    if (options.onclick) newElement.onclick = options.onclick;
    newElement.id = options.id || element.id;
    element.replaceWith(newElement);
};

interface grooveSnapshot {
    updateCustomShipping: boolean;
}

interface grooveDidUpdateParams {
    previous: {
        props: any;
        state: any;
    };
    current: {
        props: any;
        state: any;
    };
    snapshot: Promise<grooveSnapshot>;
}

const grooveDidUpdate = ({
    previous,
    current,
    snapshot,
}: grooveDidUpdateParams) => {
    if (snapshot && process.env.NODE_ENV === "development") {
        snapshot.then(({ updateCustomShipping }) => {
            if (
                updateCustomShipping &&
                current.state.grooveCheckout !== previous.state.grooveCheckout
            ) {
                console.log("[GROOVE]", {
                    updateCustomShipping,
                    previous,
                    current,
                });
            }
        });
    }
};


const bcService = createCheckoutService();

const GrooveModal = ({checkoutState, onChange, ...rest }: any) => {
    let props = rest?.checkoutProps;
    let cart_id = props?.cart?.id;
    const [modalState, setModalState] = React.useState({ selected: '' });
    const [availableShippingOptions, setAvailableShippingOptions] = React.useState([]);
    const [state, setState] = React.useState<{ [key: string]: any; }>({ data: undefined});
    React.useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.log("MODAL");
            console.dir(checkoutState);
            console.log(`SELECTED : ${modalState.selected}`);
            
        }
        let c = props?.consignments?.reduce((c:any)=> c);
        if(c?.availableShippingOptions) {
            setAvailableShippingOptions(c.availableShippingOptions);
            console.log({cart_id});
            bcService.loadCheckout(cart_id).then((st:any)=> setState(st));

        }
        if (state.data) {
            console.log('[GROOVE] loaded service for cart', cart_id)
            console.log(state.data?.getCheckout());
            bcService.loadPaymentMethods().then((payments:any)=>console.log(payments.data.getPaymentMethods()));

        }
    }, [checkoutState.grooveCheckout, modalState]);

    const localOnChange = (e:any) => {
        e.preventDefault();
        console.log(e.target.value);
        setModalState({selected: e.target.value});
    }

    return (
        <Modal
            key="calendar-modal"
            isOpen={checkoutState.grooveCheckout.showCalendar}
            contentLabel="Shipping Method"
        >
            <h2 className="stepHeader-title optimizedCheckout-headingPrimary">
                Select Delivery Options
            </h2>
            <hr />
            <h4>Shipping Method</h4>
            <DynamicInput 
                id="shippingMethod"
                name="shippingMethod"
                fieldType={DynamicFormFieldType.dropdown}
                options={[
                    {label: "--Please choose an option--", value: ""},
                    ...availableShippingOptions.map((asm:any) => 
                        ({label: `${asm.description} $${asm.cost.toFixed(2)}`, value: asm.description }))
                ]}
                value={modalState.selected}
                onChange={localOnChange}
             />
             
            {modalState?.selected?.length > 0 &&
            <>
            <h4>Delivery Date</h4>
            <DatePicker
                wrapperClassName="datePicker"
                minDate={grooveDays(checkoutState.grooveCheckout).minDate}
                maxDate={grooveDays(checkoutState.grooveCheckout).maxDate}
                selected={checkoutState.grooveCheckout.shipDate}    
                onChange={onChange}
                inline
            >
                <div style={{ color: "red" }}>Select a shipping day</div>
            </DatePicker>
            </>}
        </Modal>
    );
};

/**
 * props that we may need for custom validation
 */
interface GrooveProps {
    checkoutId: string;
    containerId: string;
    [key: string]: any;
}

/**
 * method to validate custom checkout requirements; called from renderStep
 *
 * in Checkout.tsx
 *
 * @param step CheckoutStepType to validate
 * @param props <Partial> props passed through the Checkout component
 * @param gc state.grooveCheckout
 * @returns
 */
const grooveCompletedStep = (
    step: CheckoutStepType,
    props: Partial<GrooveProps>,
    gc: GrooveCheckout
): boolean => {
    // custom requirement validation
    let ok = true;
    const { checkoutId } = props;
    switch (step) {
        case CheckoutStepType.Shipping:
            if (process.env.NODE_ENV === "development") {
                console.log(`checkoutId: ${checkoutId}`);
            }
            if (!gc.shipDate) {
                ok = false;
            }
            break;

        default:
            break;
    }

    return ok;
};

const grooveDays = (gc: Partial<GrooveCheckout> | undefined) => {
    // calculate shipping days here.
    if (gc) {
        console.log("groove checkout", gc);
    }
    let minDate = new Date(new Date().getTime());
    let maxDate = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);
    return { minDate, maxDate };
};


const GrooveCalendar = (props: any) => {
    return (
        <DatePicker
            wrapperClassName="datePicker"
            minDate={props.minDate}
            maxDate={props.maxDate}
            selected={props.selected}
            onChange={props.onChange}
            inline
            withPortal
        >
            <div style={{ color: "red" }}>Select a shipping day</div>
        </DatePicker>
    );
};

const GrooveCalendarButton = (props: any) => {
    const renderCalendar = () => (
        <GrooveCalendar
            id="groove-calendar-element"
            key="groove-calendar"
            contentLabel="Select your shipping day"
            minDate={grooveDays(undefined).minDate}
            maxDate={grooveDays(undefined).maxDate}
        />
    );

    const renderButton = () => (
        <>
        <Button id="groove-custom-shipping-btn" variant={ButtonVariant.Action}>
            Please Select Your Delivery Date & Method
        </Button>
        </>
    );
    return (
        <div id="div-before-comments">
            {/* <h4 id="groove-custom-message-h4">Thank you for order,</h4> */}
            {props.showCalendar ? renderCalendar() : renderButton()}
            <p id="groove-custom-message-p"></p>
        </div>
    );
};

const grooveShowCalendar = (consignments: any[]) => {
    const showCalendar: boolean =
        consignments.length > 0 &&
        consignments[0].selectedShippingOption?.type !== "shipping_pickupinstore";
    return showCalendar;
};

export {
    GrooveCheckout,
    ReConnectElement,
    ReConnectOptions,
    grooveCheckoutValues,
    grooveCompletedStep,
    grooveDidUpdate,
    grooveSnapshot,
    grooveDays,
    GrooveModal,
    GrooveCalendar,
    GrooveCalendarButton,
    grooveShowCalendar,
};
