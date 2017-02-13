import React from 'react';
import Isvg from 'react-inlinesvg';
import {colors} from 'material-ui/styles';
import ReactTooltip from 'react-tooltip';
import configs from 'js/utils/configs';
import OutLink from 'js/components/sub_components/out_link';

const Footer = props => {
    return (
        <div className="py4 relative" style={{color: colors.blueGrey50, width: '100%'}}>
            <div className="col lg-col-4 md-col-4">&nbsp;</div>
            <div className="col lg-col-4 md-col-4 madeWithLove">
                <div className="mx-auto" style={{width: 152, height: 22}}>
                    <div className="left">Made with</div>
                    <div className="left" data-tip data-for="heartTooltip">
                        <Isvg src="/svgs/mini_heart.svg">
                          <img src="/imgs/mini_heart.gif" />
                        </Isvg>
                    </div>
                    <div className="left">in Berlin</div>
                    <ReactTooltip id="heartTooltip">{'Happy valentine\'s day Marlene!'}</ReactTooltip>
                </div>
            </div>
            <div className="col lg-col-4 md-col-4 github">
                <OutLink
                    style={{color: colors.blueGrey50}}
                    className="text-decoration-none right"
                    href={configs.GITHUB_PROJECT} >
                    <img className="left" width="18px" src="/imgs/github.png" />
                    <div className="left pl1">Github</div>
                </OutLink>
            </div>
        </div>
    );
}

export default Footer;
