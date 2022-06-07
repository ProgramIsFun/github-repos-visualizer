import React, {useEffect, useMemo, useState} from "react";
import {connect} from 'react-redux';
import HighLight from "./MainGraphDir/HighLight";
import ReactForceGraph from "./MainGraphDir/ReactForceGraph";
import TextNodeVR from "./MainGraphDir/TextNodeVR";
import GitHub from 'github-api';
import {dbbbbb} from "../firebase/firebase";
import {auth} from "firebase";
import {cgg} from "../util/cgg";

import * as firebase from 'firebase/app'
import {datassss, genRandomTree} from "../util/helperfile";
import TextNode from "./MainGraphDir/TextNode";
import BuildGraph from "./MainGraphDir/BuildGraph";


function Home({...state}) {
    // by here you control the logic

    // add node  remove node     save to db etc

    const [dd, setdd] = useState()
    const [page, setpage] = useState(4)
    const [repo, setrepo] = useState(0)
    const [notice, setnotice] = useState("")
    console.log("entering home ,data dd is now ", dd)


    // this part is original for highlight the node 2d graph when hoving over the node
    const data = useMemo(() => {
        const gData = genRandomTree(80);

        // cross-link node objects
        gData.links.forEach(link => {
            const a = gData.nodes[link.source];
            const b = gData.nodes[link.target];
            !a.neighbors && (a.neighbors = []);
            !b.neighbors && (b.neighbors = []);
            a.neighbors.push(b);
            b.neighbors.push(a);

            !a.links && (a.links = []);
            !b.links && (b.links = []);
            a.links.push(link);
            b.links.push(link);
        });

        return gData;
    }, []);


    useEffect(() => {
        setdd({nodes: [], links: []})
        // fetch(datassss).then(res => res.json()).then(data => {
        //     console.log("data ", data)
        //     setdd(data)
        // })
    }, [])

    const loadSample = () => {

        setdd(datassss)
    }

    const removeHalfLinks = () => {

        if (dd["links"].length === 0) {
            return
        }
        setdd({
            links: [
                ...dd["links"].splice(0, Math.ceil(dd["links"].length / 2))
            ],
            nodes: [
                ...dd["nodes"]

            ]
        })
    }
    // now need to find some exaple with button available outthere.


    const returnGraph = (index) => {
        // is it really correct to share the same dd?
        // they add property such as position information, we dont want these.
        // so 3d and 3d-vr maybe should just take a deep copy of the data

        // and 2d , should think a way for avoiding those position information being added there
        // since when we load the graph, the new rendering will determine the correct position base on force
        let middle= [
            <ReactForceGraph dd={dd}/>,
            <HighLight dd={dd}/>,
            <TextNodeVR dd={dd}/>,
            <TextNode dd={dd}/>,
            <BuildGraph dd={dd} setdd={setdd} repo={repo}/>]
            [index]

        return <div style={{
            border: "3px solid blue",
        }}>{middle}</div>
    }


    function processData(dd) {


        // for node, just store the id and the display name
        let hinode = dd.nodes.map(({id, name, repoid,...keepAttrs}) => {

                return {id,
                    name:name===undefined?"dummyname":name,
                    repoid:repoid===undefined?0:repoid   // 0 is any custom added node ( not repo)
                }


            }
        )


        // for link, store the id and the source and target
        // let hilinks = dd.links.map(({index, source, target, ...keepAttrs}) => {
        //         return {index, source: {id: source.id}, target: {id: target.id}}
        //     }
        // )
        let hilinks = dd.links.map(({index, source, target, ...keepAttrs}) => {
                return {index, source:  source.id, target: target.id}
            }
        )

        console.log("after process data, dd is now ", dd)
        return {nodes: hinode, links: hilinks}
    };


    const saveGraph = async () => {
        // Problem: all graph will add custom objects into graph
        //                SO what to save
        // QUESTION: https://github.com/vasturiano/react-force-graph/issues/376
        // ANS: save x y z is enough if u need position

        console.log("processing data , saving only important properties", dd)

        setnotice(" start saving graph. ")
        // so here  just filter the object to contain important.
        let finalData = processData(dd)
        setnotice(p=>p+"removed unused attributes ")

        var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
        // save graph to db
        await dbbbbb.collection("users").doc(auth().currentUser.uid).collection("graphsavedtest").doc().set({
            graphdata: finalData,
            time: myTimestamp

        })
        setnotice(p=>p+"saved")
    }

    const loadGraphFromLastSave = async () => {
        // filter the latest time saved graph from firebase firestore



        let loadeddata = await dbbbbb.collection("users").doc(auth().currentUser.uid).collection("graphsavedtest").orderBy("time", "desc").limit(1).get()
        loadeddata.forEach(doc => {
            console.log(doc.id, '=>', doc.data().graphdata);
            setdd(doc.data().graphdata)
        });
        // console.log("loadeddata ", loadeddata.docs.data)
        // setdd(loadeddata)

    }

    const getRepoData = async () => {
        cgg("getting")
        setnotice("getting data from github api")
        // case 1 we call REST directly


        // const repoUrl = `https://api.github.com/users/${username}/repos`;
        //
        // // console.log
        // const config = {
        //     headers: { Authorization: `Bearer ${access_token}` }
        // };
        // console.log("making request to ",repoUrl)
        // axios.get(repoUrl,null,config).then((responses) => {
        //     // console.log("responsesssss",responses)
        //     const repos = responses.data.map(({name, language, html_url, created_at, description}) => {
        //         return {name, language, html_url, created_at, description};
        //     })
        //     // console.log("origin response is ",response);
        //     console.log("addsssssssssssssss ", repos.length);
        //     response["repo"] = repos;
        //     console.log("returning to ")
        //     return res.status(200).json(response);
        //
        // }).catch(error => {
        //     console.log(`inside getrepos error1233213333: ${error}`)
        //     // this.setState({
        //     //     errorMessage: error.response.statusText
        //     // })
        // });


        // case 2 use library that call REST for you
        // https://github.com/github-tools/github


        // need to get the token from server first
        var docRef = dbbbbb.collection("users").doc(auth().currentUser.uid);

        const doc = await docRef.get()
        let ttoken = doc.data().accessToken
        // cgg(doc.data().accessToken)

        // let tokenn=

        const gh = new GitHub({
            token: ttoken
            // make sure this has repo scope right for private repo list

            // however for safty, no read only scope  https://stackoverflow.com/a/72326284/10964992
            // dangerous as hell

            // user has to tick the organization access in order for listing the repo in that organization that user have access
            // what should user do if they want to add in more organization?
            // 1. tell them logout github doesnt work
            // 2. tell them to change scope in their github account
            //   2.1 after change, does original access token have effect?  Yes
            //
            // also note if ac A approve oauth app D to access organization C,  ac B(if member of C) could see D have access to C in oauth procedure


        });

        const me = gh.getUser();


        let repoos;
        try {
            repoos = await me.listRepos()
            setnotice(p => {
                return p + " successful, got " + repoos.data.length + " repos."
            })
            // this list all repo!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // later also user UI will wait for data retriving.

            /////////////////////////////////////////// IF promise chain intead of async
            // .then(function({data: reposJson}) {
            //     console.log(`clayreimann has ${reposJson.length} repos!`);
            //     console.log(reposJson)
            // });
        } catch (e) {
            setnotice(p => {
                return p + "Fail, access token not longer valid, maybe user revoke access "
            })
            console.log("this access token not longer valid, maybe user revoke access  ")
            return
        } finally {
        }


        cgg("stored", repoos)
        setrepo(repoos.data)

        setnotice(p => {
            return p + " saving data to database."
        })
        var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());

        // one request in one document or inside one document?
        await dbbbbb.collection("users").doc(auth().currentUser.uid).collection("repofetch").doc().set({
            repodata: repoos.data,
            time: myTimestamp

        })

        setnotice(p => {
            return p + " Succesfully saved data to database."
        })
        return
    }


    const emptyGraph = async () => {
        // node none, link none
        setdd({nodes: [], links: []})

    }
    return (

        <div
            style={{
                border: "3px solid purple",
            }}
        ><p>Edit is only possible in 2d-build ,after u edit, u could use 3d or 3d-vr to visualize</p>
        <p>you could loadSample and go to 3d-vr to try the effect first</p>
            <p>{notice}</p>
            <button id="emit-particles-btn" onClick={emptyGraph}>emptyGraph</button>
            <button id="emit-particles-btn" onClick={loadSample}>loadSample</button>
            {/*<button id="emit-particles-btn" onClick={removeHalfLinks}>removeHalfLinks</button>*/}

            <button id="emit-particles-btn" onClick={saveGraph}>saveGraph</button>
            <button id="emit-particles-btn" onClick={loadGraphFromLastSave}>loadGraphFromLastSave</button>
            <p></p>
            <button id="emit-particles-btn" onClick={() => setpage(0)}>3d</button>
            {/*<button id="emit-particles-btn" onClick={() => setpage(1)}>2d</button>*/}
            <button id="emit-particles-btn" onClick={() => setpage(2)}>3d-vr</button>
            {/*<button id="emit-particles-btn" onClick={() => setpage(3)}>2d-text</button>*/}
            <button id="emit-particles-btn" onClick={() => setpage(4)}>2d-build</button>
            {page==4 && <button id="emit-particles-btn" onClick={getRepoData}>getAllRepos</button>}
            {/*<Force_directed_simple></Force_directed_simple>*/}
            {returnGraph(page)}

        </div>

    );
}


function mapStateToProps(state) {
    return state;
}

const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        // increment: () => dispatch({ type: 'INCREMENT' }),
        // decrement: () => dispatch({ type: 'DECREMENT' }),
        // logout: () => dispatch({type: 'LOGOUT'}),
        // fetchUser:() => dispatch(fetchUser()), //https://stackoverflow.com/a/56419637/10189759
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);