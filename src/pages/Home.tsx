/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/media-has-caption */
import { ChangeEvent, useRef, useState } from 'react';

import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid';

export default function Home() {
    const audio = useRef<HTMLAudioElement | null>(null);
    const [files, setFiles] = useState<string[]>([]);
    const [current, setCurrent] = useState<File | null>(null);
    const [mode, setMode] = useState('stop');
    const [show, setShow] = useState(true);
    const currentTime = useRef<number>(0);
    const volumeRef = useRef<HTMLInputElement | null>(null);
    const [volume, setVolume] = useState(0.5);
    const [volumeHeight, setVolumeHeight] = useState('50%');

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url: string = URL.createObjectURL(file);
            setFiles((prev) => [...prev, url]);
            setCurrent(file);
            if (audio.current) {
                audio.current.src = url;
            }
        }
    };

    const onPlay = () => {
        if (audio.current) {
            audio.current.load();

            switch (mode) {
                case 'stop':
                    setMode('play');
                    audio.current.play();
                    break;
                case 'pause':
                    setMode('play');
                    audio.current.currentTime = currentTime.current;
                    audio.current.play();
                    break;
                case 'play':
                    setMode('pause');
                    audio.current.pause();
                    break;
                default:
                    break;
            }
        }
    };

    const onTimeUpdate = (e: React.SyntheticEvent<EventTarget>) => {
        const event = e.currentTarget as HTMLAudioElement;
        if (!audio.current?.paused && !audio.current?.ended) {
            currentTime.current = event.currentTime;
        }
    };

    const onScreenClick = () => setShow((prev) => !prev);

    const onVolumeUp = () => {
        if (audio.current) {
            audio.current.load();
            const newVolume = volume === 100 ? volume : volume + 0.1;
            audio.current.volume = newVolume;
            volumeRef.current!.value = String(newVolume);
            setVolume(newVolume);
            setVolumeHeight(`calc(100% - ${Math.floor(newVolume * 100)}%)`);
        }
    };

    const onVolumeDown = () => {
        if (audio.current) {
            audio.current.load();
            const newVolume = volume === 0 ? volume : volume - 0.1;
            audio.current.volume = newVolume;
            volumeRef.current!.value = String(newVolume);
            setVolume(newVolume);
            setVolumeHeight(`calc(100% - ${Math.floor(newVolume * 100)}%)`);
        }
    };

    // TODO : When Music playing, show sound effect animation

    return (
        <main className="w-full min-h-screen flex justify-center items-center flex-col gap-2.5">
            <label htmlFor="file" className="w-[300px]">
                <p className="cursor-pointer ml-auto text-white w-fit bg-black text-[12px] font-bold p-2.5 rounded-md">파일 업로드</p>
                <input id="file" className="hidden" type="file" accept="audio/*" onChange={onChange} onClick={(e) => (e.currentTarget.value = '')} />
            </label>
            <div className="relative w-[300px] h-[500px] bg-black rounded-md p-5">
                <div className="absolute -right-[5px] flex flex-col gap-[0.5px]">
                    <button className="w-[5px] h-[30px] bg-black" aria-label="volume up" title="volume up" type="button" onClick={onVolumeUp} />
                    <button className="w-[5px] h-[30px] bg-black" aria-label="volume down" title="volume down" type="button" onClick={onVolumeDown} />
                </div>
                <div className="overflow-hidden w-full h-[150px] bg-blue-50 rounded-md border-2 p-2.5 border-black" role="button" tabIndex={-1} onKeyDown={onScreenClick} onClick={onScreenClick}>
                    <p className="text-[12px] font-semibold font-mono">{current && current?.name}</p>
                </div>
                {show && (
                    <label htmlFor="volume" className="overflow-hidden w-[20px] h-[100px] absolute top-[45px] right-[30px] bottom-[45px] bg-blue-50">
                        <div style={{ height: volumeHeight }} className="z-50 h-0 w-[17px] bg-blue-50 absolute top-[-1px] right-0" />
                        <input
                            disabled
                            ref={volumeRef}
                            id="volume"
                            className="h-0 w-[99px] absolute top-[41px] right-[-41px] appearance-none focus:outline-none -rotate-90"
                            type="range"
                            max={1}
                            min={0}
                            step={0.1}
                            defaultValue={volume}
                        />
                    </label>
                )}
                <div className="py-[100px] flex justify-center items-center">
                    <div className="relative bg-white text-black rounded-full w-[150px] h-[150px]">
                        <button className="absolute top-[7px] left-[calc(50%-22.5px)] w-[45px] text-[12px] uppercase font-semibold" type="button">
                            Menu
                        </button>
                        <button title="rewind" className="absolute -left-[5px] top-[calc(50%-9px)] w-[45px] flex justify-center items-center" type="button">
                            <BackwardIcon className="w-[18px] h-[18px]" />
                        </button>
                        <div className="absolute top-1/2 left-1/2 [transform:translate(-50%,-50%)] bg-black rounded-full w-[75px] h-[75px]">
                            <audio ref={audio} controls className="hidden" onTimeUpdate={onTimeUpdate} />
                        </div>
                        <button className="absolute bottom-[10.5px] right-[calc(50%-22.5px)] w-[45px] flex justify-center items-center uppercase" type="button" onClick={onPlay}>
                            <PlayIcon className="w-[12px] h-[12px]" />
                            <PauseIcon className="w-[12px] h-[12px]" />
                        </button>
                        <button title="fast forward" className="absolute -right-[5px] bottom-[calc(50%-9px)] w-[45px] flex justify-center items-center" type="button">
                            <ForwardIcon className="w-[18px] h-[18px]" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
