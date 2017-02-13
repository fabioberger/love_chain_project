import React from 'react';
import {Dialog, FlatButton} from 'material-ui';
import {colors} from 'material-ui/styles';
import configs from 'js/utils/configs';
import OutLink from 'js/components/sub_components/out_link';

const PublicNodeNoticeDialog = props => {
    const dialogActions = [
        <FlatButton
            label={'Ok'}
            primary={true}
            onTouchTap={() => props.toggleDialogFn(false)} />,
    ];

    return (
        <Dialog
            title="Enable wallet communication"
            actions={dialogActions}
            open={props.isOpen}
            contentStyle={{width: '400px'}}
            onRequestClose={() => props.toggleDialogFn(false)}
            autoScrollBodyContent={true} >
            <div className="pt2" style={{color: colors.grey700}}>
                <div>
                    In order to create or accept valentine requests on the ethereum blockchain, we need
                     a way to interact with an ethereum wallet you control. There are two easy ways you
                      can enable us to do that:
                </div>
                <h4>1. Chrome extension ethereum wallet</h4>
                <div>
                    You can install a chrome extension ethereum wallet such as{' '}
                    <OutLink href={configs.METAMASK_CHROME_STORE_URL}>
                        Metamask
                    </OutLink>. Once installed and set up, send a small amount of ether to one of the
                    wallet addresses and refresh this page.
                </div>
                <h4>2. Use the Mist browser</h4>
                <div>
                    Install the <a href={configs.MIST_DOWNLOAD_URL}>Mist</a> app, send some ether to one
                    of your mist addresses, and browse to this site from within the in-app Mist browser.
                </div>
            </div>
        </Dialog>
    );
};

export default PublicNodeNoticeDialog;
