import {ForceGraphVR} from 'react-force-graph';

import React, {useEffect, useState} from 'react';


import cloneDeep from 'lodash/cloneDeep';

let SpriteText=window.SpriteText

export default function TextNodeVR({dd}) {
    // console.log(dd)

    console.log("enteringVR, deepclone property,await mutation to original prop")
    
    const newdd = cloneDeep(dd);
    return <>
        <p>Use W-A-S-D to move,    drag mouse to change view angle</p>
        <ForceGraphVR
        graphData={newdd}
        nodeAutoColorBy="group"
        nodeThreeObject={node => {
            const sprite = new SpriteText(node.id);
            sprite.color = node.color;
            sprite.textHeight = 8;
            return sprite;
        }}
        // nodeThreeObjectExtend={true}
    /></>
}