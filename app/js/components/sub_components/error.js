import _ from 'lodash';
import React from 'react';
import {Paper} from 'material-ui';
import configs from 'js/utils/configs';

const errorTypeToMessage = {
    NO_WEB3_INSTANCE_FOUND: (
        <span>
            We did not find a web3 instance on the page. Install{' '}
            <a target="_blank" href={configs.METAMASK_CHROME_STORE_URL}>
                Metamask
            </a> or visit this page in the <a target="_blank" href={configs.MIST_DOWNLOAD_URL}>Mist browser</a>.
        </span>
    ),
    DISCONNECTED_FROM_ETHEREUM_NODE: (
        <span>
            Hm... looks like the backing ethereum node is offline.
        </span>
    ),
    CONTRACT_NOT_DEPLOYED_ON_NETWORK: (
        <span>
            The ValentineRegistry contract was not deployed to the Ethereum network you are connected to.
            Please make sure you are connected to the right network.
        </span>
    ),
    UNHANDLED_ERROR: <span>An error occured. Please refresh.</span>,
};

const Error = props => {
    const centerStyling = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    const style = {
        position: 'relative',
        height: 200,
        ...centerStyling,
    };

    let errorNode = errorTypeToMessage[props.type];
    if (_.isUndefined(errorNode)) {
        console.log(`Error of type: ${props.type} not found in Error components errorTypeToMessage map`);
        errorNode = errorTypeToMessage.UNHANDLED_ERROR;
    }

    return (
        <Paper
            className="errorPaper"
            style={style}
            zDepth={1} >
            <div style={{width: '90%', ...centerStyling}}>
                {errorNode}
            </div>
        </Paper>
    );
};

export default Error;
