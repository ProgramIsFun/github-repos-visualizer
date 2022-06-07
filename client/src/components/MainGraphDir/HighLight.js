import React, {useCallback, useMemo, useState} from 'react';
import {ForceGraph2D} from "react-force-graph";


export default function HighLight({dd}) {


    // for the highlight to correct run ,  need a property storing the connected neightbour , just see the source of example of react-force-graph
    // I temp just feed in normal data without neighbour property, so it is highlight hover node only


    const NODE_R = 10;

    let data=dd

    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [hoverNode, setHoverNode] = useState(null);

    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };


    // real time compute neight is costly,  maybe recompute once each time a graph change
    const handleNodeHover = node => {
        highlightNodes.clear();
        highlightLinks.clear();


        // if hovering on some node
        if (node) {
            // hover node is highlighted
            highlightNodes.add(node);

            // need a property storing the connected neightbour,

            if (node.neighbors){
                node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
                node.links.forEach(link => highlightLinks.add(link));
            }// why dont we compute it on the fly?
            else{

                // TO DO

            }

        }

        setHoverNode(node || null);
        updateHighlight();
    };

    const handleLinkHover = link => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
        }

        updateHighlight();
    };

    const paintRing = useCallback((node, ctx) => {
        // add ring just for highlighted nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
        ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
        ctx.fill();
    }, [hoverNode]);

    return <ForceGraph2D
        graphData={data}

        nodeRelSize={NODE_R}

        autoPauseRedraw={false}
        linkWidth={link => highlightLinks.has(link) ? 5 : 1}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
        nodeCanvasObjectMode={node => highlightNodes.has(node) ? 'before' : undefined}
        nodeCanvasObject={paintRing}
        onNodeHover={handleNodeHover}
        onLinkHover={handleLinkHover}
    />;

}