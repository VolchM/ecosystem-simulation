import RandomizedStat from "../simulation/RandomizedStat";
import "./InputFields.css";

export type NumberInputFieldProps = {
    value: number,
    min?: number,
    max?: number,
    title?: string,
    step?: number | string,
    onChange: (value: number) => void
}

export function NumberInputField({ value, min, max, title, step = "any", onChange }: NumberInputFieldProps): React.JSX.Element {
    function handleChange(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        e.target.reportValidity();
        onChange(e.target.valueAsNumber);
    }
    return <input className="number-input-field" type="number" title={title} value={isNaN(value) ? "" : value} min={min} max={max} step={step} onChange={handleChange} required />;
}

export type NumberInputRowProps = {
    label: string,
    value: number,
    min?: number,
    max?: number,
    step?: number | string,
    onChange: (value: number) => void;
}

export function NumberInputRow({ label, value, min, max, step = "any", onChange }: NumberInputRowProps): React.JSX.Element {
    return (
        <div className="input-row">
            <span>{label}</span>
            <NumberInputField value={value} min={min} max={max} step={step} onChange={onChange} />
        </div>
    );
}

export type RandomizedStatInputRowProps = {
    label: string,
    value: RandomizedStat,
    min?: number,
    max?: number,
    onChange: (value: RandomizedStat) => void;
}

export function RandomizedStatInputRow({ label, value, min, max, onChange }: RandomizedStatInputRowProps): React.JSX.Element {
    function setMean(mean: number) {
        onChange(new RandomizedStat(mean, value.stdev));
    }
    function setStdev(stdev: number) {
        onChange(new RandomizedStat(value.mean, stdev));
    }

    let stdevMax: number | undefined = undefined;
    if (min !== undefined) {
        stdevMax = Math.floor((value.mean - min) / 3);
    }
    if (max !== undefined) {
        if (stdevMax === undefined) {
            stdevMax = Math.floor((max - value.mean) / 3);
        } else {
            stdevMax = Math.min(stdevMax, Math.floor((max - value.mean) / 3));
        }
    }

    return (
        <div className="input-row">
            <span style={{marginRight: "auto"}}>{label}</span>
            <div>
                <NumberInputField title= "Среднее значение нормального распределения"
                            value={value.mean} min={min} max={max} step="any" onChange={setMean} />
                <span> ± </span>
                <NumberInputField title={"Стандартное отклонение нормального распределения\nС вероятностью ~68% значение будет на расстоянии не более 1-го стандартного отклонения от среднего\n" +
                            "С вероятностью ~27% - между 1-м и 2-мя стандартными отклонениями\nС вероятностью ~5% - между 2-мя и 3-мя стандартными отклонениями (предел)"}
                            value={value.stdev} min={0} max={stdevMax} step="any" onChange={setStdev} />
            </div>
        </div>
    );
}

export type TextInputFieldProps = {
    value: string,
    title?: string,
    maxLength?: number,
    onChange: (value: string) => void
}

export function TextInputField({ value, title, maxLength, onChange }: TextInputFieldProps): React.JSX.Element {
    function handleChange(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        e.target.reportValidity();
        onChange(e.target.value);
    }
    return <input className="text-input-field" type="text" value={value} title={title} maxLength={maxLength} onChange={handleChange} required />;
}

export type SelectInputRowProps = {
    label: string,
    options: string[],
    value: string[],
    onChange: (value: string[]) => void
}

export function SelectInputRow({ label, options, value, onChange }: SelectInputRowProps): React.JSX.Element {
    function handleChange(e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
        e.target.reportValidity();
        onChange(Array.from(e.target.selectedOptions, option => option.value));
    }
    return (
        <div className="input-row">
            <span>{label}</span>
            <select className="select-input" value={value} onChange={handleChange} size={1} multiple>
                {options.map(option => 
                    <option>{option}</option>
                )}
            </select>
        </div>
    );
}

export type ColorPickerRowProps = {
    label: string,
    value: string,
    onChange: (value: string) => void
}

export function ColorPickerRow({ label, value, onChange }: ColorPickerRowProps): React.JSX.Element {
    function handleChange(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        e.target.reportValidity();
        onChange(e.target.value);
    }
    return (
        <div className="input-row">
            <span>{label}</span>
            <input className="color-picker" type="color" value={value} onChange={handleChange} required />
        </div>
    );
}
