import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ForceGraph2D} from "react-force-graph";
import cloneDeep from "lodash/cloneDeep";


export default function BuildGraph({dd, setdd, repo}) {

    console.log("buildgraph mount")
    // https://github.com/vasturiano/react-force-graph/issues/377
    const fgRef = useRef();


    const [ddd, setddd] = useState({nodes: [], links: []})


    // const [nodes,setnodes]= useState([])
    // const [nodes,setnodes]= useState([])


    // let data = dd


    ///////////////////////////////////////////////////////////////////////
    // need refactor these into useState or useRef
    // let nodeIdCounter = 0, linkIdCounter = 0;
    // let nodes = [], links = [];
    // let dragSourceNode = null, interimLink = null;

    const nodeIdCounter = useRef(0)
    const linkIdCounter = useRef(0)
    // console.log("dd.node",dd?.nodes,dd?.links)
    const nodes = useRef([])
    const links = useRef([])
    const dragSourceNode = useRef(null)
    const interimLink = useRef(null)
    ///////////////////////////////////////////////////////////////////////
    // console.log("hihi", nodes, links)


    const snapInDistance = 15;
    const snapOutDistance = 40;


    useEffect(() => {
        // // add controls GUI
        // let dat=window.dat
        //
        // const gui = new dat.GUI();
        // gui.add(controls, 'DAG Orientation', ['td', 'bu', 'lr', 'rl', 'radialout', 'radialin', null])
        //     .onChange(forceUpdate);
        if (dd) {
            setddd(dd)
        }


        if (nodes.current && dd) {
            nodes.current = dd.nodes
        }
        if (links.current && dd) {
            links.current = dd.links
        }
    }, [dd]);


    const updateGraphData = () => {

        console.log("try to update ddd to nodes", nodes, "links", links)

        // set the data

        // either
        //
        // CASE 1
        // data=XXXX
        //
        // ddd = tempp

        //
        // CASE 2
        // or  setdata()
        // Graph.graphData({ nodes: nodes, links: links });


        const tempp = {
            links: links.current,
            nodes: nodes.current
        }


        // passing a deep copy to force graph

        // let clone1=cloneDeep(tempp)

        // final update data to feed to force graph, let it rerender
        setddd(tempp)


        // updating the parent also
        setdd(tempp)
    }
    const distance = (node1, node2) => {
        return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
    };

    const rename = (nodeOrLink, type) => {
        let value = prompt('Name this ' + type + ':', nodeOrLink.name);
        if (!value) {
            return;
        }
        nodeOrLink.name = value;
        updateGraphData();
    };

    const setInterimLink = (source, target) => {
        let linkId = linkIdCounter.current++;
        interimLink.current = {id: linkId, source: source, target: target, name: 'link_' + linkId};
        links.current.push(interimLink.current);
        updateGraphData();
    };

    const removeLink = link => {
        links.current.splice(links.current.indexOf(link), 1);
    };

    const removeInterimLinkWithoutAddingIt = () => {
        removeLink(interimLink.current);
        interimLink.current = null;
        updateGraphData();
    };

    const removeNode = node => {
        links.current
            .filter(link => link.source === node || link.target === node)
            .forEach(link => removeLink(link));
        nodes.current.splice(nodes.current.indexOf(node), 1);
    };


    const testUpdate = () => {

        const tempp = {
            links: [
                ...dd["links"].splice(0, Math.ceil(dd["links"].length / 2))
            ],
            nodes: [
                ...dd["nodes"]
            ]
        }
        console.log("seems doesnt trigger rerender of anything, but graph updates")


        // data = tempp

        // const removeHalfLinks = () => {
        //
        //     if (dd["links"].length===0){return}
        //     setdd({
        //         links: [
        //             ...dd["links"].splice(0, Math.ceil(dd["links"].length/2))
        //         ],
        //         nodes: [
        //             ...dd["nodes"]
        //
        //         ]
        //     })
        // }


    }


    const dragFun = dragNode => {
        dragSourceNode.current = dragNode;
        for (let node of nodes.current) {
            if (dragNode === node) {
                continue;
            }

            // close enough: snap onto node as target for suggested link
            if (!interimLink.current && distance(dragNode, node) < snapInDistance) {

                console.log("detect,  shall now snap in ")
                setInterimLink(dragSourceNode.current, node);
            }


            // close enough to other node: snap over to other node as target for suggested link
            if (interimLink.current && node !== interimLink.current.target && distance(dragNode, node) < snapInDistance) {
                removeLink(interimLink.current);
                setInterimLink(dragSourceNode.current, node);
            }
        }
        // far away enough: snap out of the current target node
        if (interimLink.current && distance(dragNode, interimLink.current.target) > snapOutDistance) {
            removeInterimLinkWithoutAddingIt();
        }
    }


    const checkExistInGraph = (item) => {

        // if such repo exist in graph

        // if we take repoid in node to be the real identifier
        let index1 = nodes.current.findIndex(node => node.repoid === item.id)
        return index1 === -1;
    }


    const addRepoInGraph = (item) => {
        // inject the repo into graph
        // if we take repoid in node to be the real identifier
        let index1 = nodes.current.findIndex(node => node.repoid === item.id)
        if (index1 === -1) {
            nodes.current.push({id: item.full_name + "test", x: 0, y: 0, name: 'node_' + item.id, repoid: item.id})
            updateGraphData()
        } else {
            console.log("already exist")
        }

    }

    const returnListRepo = () => {

        // when graph change this will rerender
        if (repo) {
            return repo.filter(checkExistInGraph).map(item => {
                return <li key={item.id} onClick={() => addRepoInGraph(item)}>{item.full_name}</li>   // need clickable so that it adds to graph
            })
        }
    }


    return <>
        <p>ADD NODE: LEFT CLICK</p>
        <p>RIGHT CLICK ON NODE: DELETE NODE</p>
        <p>RIGHT CLICK ON LINK: DELETE LINK</p>
        <p>DRAG node A near node B: ADD connection A->B</p>
        {/*<p>number of repos fetch last time from github:{}</p>*/}
        {/*<p>number of repos that is not in the graph yet:{}</p>*/}
        <p>{"Click getAllRepos, below will then show the list of repo (that you gave us access) that is not in the graph yet, left click any row to add that repo into the graph"}</p>
        <p>{returnListRepo()}</p>

        <div style={{  border: "3px solid green",}}>
            <ForceGraph2D
                ref={fgRef}
                graphData={ddd}
                linkDirectionalArrowLength={8}
                linkDirectionalArrowRelPos={1}
                nodeAutoColorBy="group"
                onNodeDrag={dragFun}

                onNodeDragEnd={() => {
                    dragSourceNode.current = null;
                    interimLink.current = null;
                    updateGraphData();
                }}

                nodeColor={node =>
                    node === dragSourceNode.current ||
                    (interimLink.current && (node === interimLink.current.source || node === interimLink.current.target))
                        ? 'orange' : null}

                linkColor={link => link === interimLink.current ? 'orange' : '#bbbbbb'}
                linkLineDash={link => link === interimLink.current ? [2, 2] : []}

                onNodeClick={
                    // (node)=>{testUpdate()}

                    (node, event) => rename(node, 'node')
                }


                onNodeRightClick={(node, event) => removeNode(node)}
                onLinkClick={(link, event) => rename(link, 'link')}
                onLinkRightClick={(link, event) => removeLink(link)}
                onBackgroundClick={


                    event => {

                        console.log("received background click")
                        //https://github.com/vasturiano/react-force-graph/issues/378

                        // use screen2GraphCoords to get the graph coordinates of the click
                        let coords = fgRef.current.screen2GraphCoords(event.layerX, event.layerY);

                        console.log("coords", coords, "currentNodeId", nodeIdCounter)

                        let nodeId = nodeIdCounter.current++;
                        nodes.current.push({id: nodeId + "test", x: coords.x, y: coords.y, name: 'node_' + nodeId});
                        updateGraphData();
                    }

                    // testUpdate
                }


                ///////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////
                // below leave it as is ,  just copy from textnode example
                nodeCanvasObject={(node, ctx, globalScale) => {


                    const label = node.id;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;

                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding


                    // This fill a white background to text
                    // ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    // ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = node.color;
                    ctx.fillText(label, node.x, node.y);

                    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                }}


                nodePointerAreaPaint={(node, color, ctx) => {
                    ctx.fillStyle = color;
                    const bckgDimensions = node.__bckgDimensions;
                    bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
                }}
            /></div>
    </>

}