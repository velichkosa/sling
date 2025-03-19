import React, {useState} from 'react';
import SlidingPanel, {PanelType} from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';

const SlidingSidePanel: React.FunctionComponent<any> = () => {
    const [openPanel, setOpenPanel] = useState<boolean>(false);
    const [panelType, setPanelType] = useState<PanelType>('left');
    const [panelSize, setPanelSize] = useState<number>(30);
    const [noBackdrop, setNoBackdrop] = useState<boolean>(false);

    return (


        <SlidingPanel
            type={panelType}
            isOpen={openPanel}
            backdropClicked={() => setOpenPanel(false)}
            size={panelSize}
            panelClassName="additional-class"
            panelContainerClassName=""
            noBackdrop={noBackdrop}
        >
            <div className="panel-container">
                <div>My Panel Content</div>
                <button type="button" className="close-button" onClick={() => setOpenPanel(false)}>
                    close
                </button>
            </div>
        </SlidingPanel>

    );
};

export default SlidingSidePanel;