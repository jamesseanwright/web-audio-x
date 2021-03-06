import {
    createAudioElement,
    renderAudioGraph,
    AudioGraph,
    Aggregation,
    AudioBufferSource,
    Oscillator,
    Gain,
    StereoPanner,
    Destination,
    setValueAtTime,
    exponentialRampToValueAtTime,
} from 'wax-core';

const fetchAsAudioBuffer = async (url, audioContext) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
};

onAudioContextResumed(async context => {
    const yodel = await fetchAsAudioBuffer('/yodel.mp3', context);
    const stereoPanner = <StereoPanner pan={0.4} />;

    renderAudioGraph(
        <AudioGraph>
            <Aggregation>
                <Oscillator
                    frequency={[
                        setValueAtTime(200, 0),
                        exponentialRampToValueAtTime(800, 3),
                    ]}
                    type="square"
                    endTime={3}
                />
                <Gain gain={0.1} />
                {stereoPanner}
            </Aggregation>
            <Aggregation>
                <AudioBufferSource
                    buffer={yodel}
                />
                <Gain gain={1.4} />
                {stereoPanner}
            </Aggregation>
            {stereoPanner}
            <Destination />
        </AudioGraph>,
        context,
    );
});
