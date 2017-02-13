import React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import Isvg from 'react-inlinesvg';
import ReactTooltip from 'react-tooltip';

const SearchBox = props => {
    const hintText = (
        <div className="relative" style={{height: 24}}>
            <div className="inline-block">
                <Isvg src="/svgs/search.svg">
                  <img src="/imgs/search.gif" />
                </Isvg>
            </div>
            <div className="inline-block absolute">Search</div>
        </div>
    );

    const passedStyles = props.style || {};
    return (
        <div
            data-tip
            data-for="searchTooltip">
            <TextField
                className={props.className || ''}
                style={{...passedStyles}}
                textareaStyle={{width: 225}}
                hintStyle={{color: colors.blueGrey50}}
                hintText={hintText}
                disabled={true}
                underlineDisabledStyle={{
                    borderBottomColor: colors.blueGrey50,
                    borderBottomStyle: 'solid',
                    width: 225,
                }}
            />
            <ReactTooltip id="searchTooltip">
                {"Coming soon! For now, press \"Cmd/Ctrl + F\" to use your browser\'s search"}
            </ReactTooltip>
        </div>
    );
}

export default SearchBox;
