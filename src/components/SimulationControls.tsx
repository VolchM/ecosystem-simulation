import { useId } from "react";
import playIcon from "../assets/play.svg";
import pauseIcon from "../assets/pause.svg";
import resetIcon from "../assets/reset.svg";
import "./SimulationControls.css";

type SimulationControlsProps = {
    paused: boolean,
    onPausedChange: (paused: boolean) => void,
    onReset: () => void,
    speed: number;
    onSpeedChange: (speed: number) => void,
}

export default function SimulationControls({ paused, onPausedChange, onReset, speed, onSpeedChange }: SimulationControlsProps): React.JSX.Element {
    const speedID = useId();

    return (
        <div className="simulation-controls">
            {paused ? <button className="icon-button play-button" onClick={() => onPausedChange(false)}><img src={playIcon} /></button>
                    : <button className="icon-button pause-button" onClick={() => onPausedChange(true)}><img src={pauseIcon} /></button>}
            <button className="icon-button reset-button" onClick={onReset}><img src={resetIcon} /></button>
            <input id={speedID} type="range" value={speed} min={0.2} max={5.0} step={0.2} onChange={(e) => onSpeedChange(Number(e.target.value))}/>
            <label htmlFor={speedID}>{speed.toFixed(1)}x</label>
        </div>
    );
}