import { useEffect, useReducer, useState } from "react";
import SimulationField from "../simulation/SimulationField.tsx";
import Plant from "../simulation/Plant.tsx";
import Vector2 from '../simulation/Vector2.tsx';
import AnimalSpecie, { AnimalDiet } from "../simulation/AnimalSpecie.tsx";
import Animal from "../simulation/Animal.tsx";
import { randomRange } from "../Utils.tsx";
import SimulationParams from "./SimulationParams.tsx";
import SimulationControls from "./SimulationControls.tsx";
import "./Simulation.css";


function createField(width: number, height: number): SimulationField {
    const herbivoreSpecie = new AnimalSpecie({
        name: "Herbivore",
        diet: AnimalDiet.Herbivore,
        maxSpeed: 50,
        visionRadius: 92,
        maxSatiety: 100,
        maxStamina: 60,
        maxAge: 120,
        satietyValue: 60,
        radius: 7,
        color: "#ecd400",
    });
    const carnivoreSpecie = new AnimalSpecie({
        name: "Carnivore",
        diet: AnimalDiet.Carnivore,
        eats: ["Herbivore"],
        maxSpeed: 80,
        visionRadius: 90,
        maxSatiety: 120,
        maxStamina: 80,
        maxAge: 90,
        satietyValue: 90,
        radius: 9,
        color: "#e20000",
    });

    const field = new SimulationField(width, height, 4);
    for (let i = 0; i < 75; i++) {
        field.addPlant(new Plant(field, Vector2.random(0, field.width, 0, field.height), 50));
    }
    for (let i = 0; i < 40; i++) {
        field.addAnimal(new Animal(field, Vector2.random(0, field.width, 0, field.height), herbivoreSpecie, randomRange(2.0, 15.0)));
    }
    for (let i = 0; i < 12; i++) {
        field.addAnimal(new Animal(field, Vector2.random(0, field.width, 0, field.height), carnivoreSpecie, randomRange(2.0, 15.0)));
    }
    return field;
}

type SimulationProps = {
    targetFPS: number,
}

export default function Simulation({ targetFPS }: SimulationProps): React.JSX.Element {
    const width = 1500, height = 1000;
    const [simulationField, setField] = useState(createField(width, height));
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [,redrawField] = useReducer((tick) => tick + 1, 0);

    useEffect(() => {
        if (paused) return;

        const targetFrameLength = 1 / targetFPS;

        let requestID = requestAnimationFrame(step);
        let lastTimestamp = performance.now();

        function step(timestamp: number) {
            if (lastTimestamp === undefined) {
                lastTimestamp = timestamp;
                requestID = requestAnimationFrame(step);
                return;
            }

            const deltaTime = (timestamp - lastTimestamp) / 1000;
            if (deltaTime >= targetFrameLength - 0.0003) {
                lastTimestamp = timestamp;
                if (deltaTime <= 0.2) {
                    simulationField.update(deltaTime * speed);
                } else {
                    // Окно не было активным
                    simulationField.update(targetFrameLength * speed);
                }
                redrawField();
            }
            requestID = requestAnimationFrame(step);
        }

        return () => cancelAnimationFrame(requestID);
    }, [simulationField, targetFPS, paused, speed]);
    
    return (
        <div className="simulation">
            <SimulationParams />
            <div className="container field-container">
                <svg className="field" width={simulationField.width} height={simulationField.height} viewBox={`0 0 ${simulationField.width} ${simulationField.height}`}>
                    {simulationField.renderObjects()}
                </svg>
            </div>
            <div className="container simulation-info">
                <SimulationControls paused={paused} onPausedChange={setPaused}
                                    onReset={() => setField(createField(width, height))}
                                    speed={speed} onSpeedChange={setSpeed} />
                <hr/>
            </div>
        </div>
    );
}
