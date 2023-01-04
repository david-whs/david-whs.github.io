/** @type {{linkColor: string, mainColor: string}} */
let styles;

window.onload = () => {
    styles = {
        linkColor: getComputedStyle(document.body).getPropertyValue("--r-link-color"),
        mainColor: getComputedStyle(document.body).getPropertyValue("--r-main-color"),
    }
    
    prepareFlownetworkSlides();
    prepareBreadthFirstSearchSlides();
};

// Top-Level functions
const prepareFlownetworkSlides = () => {
    let flownetworkSVGDocuments = getFlownetworkSVGDocuments();
    colorFlownetworks(flownetworkSVGDocuments);

    [2,3,4,5,6,7].forEach((x) => colorText(flownetworkSVGDocuments.get(`flownetwork-${x}`)));
    [1,2].forEach((x) => colorText(flownetworkSVGDocuments.get(`bfs-${x}`)));

    [2,3].forEach((x) => colorSourceVertex(flownetworkSVGDocuments.get(`flownetwork-${x}`)));
    colorTargetVertex(flownetworkSVGDocuments.get("flownetwork-3"));

    [5,6,7].forEach((x) => disableFontStyles(flownetworkSVGDocuments.get(`flownetwork-${x}`)));
    [1,2].forEach((x) => disableFontStyles(flownetworkSVGDocuments.get(`bfs-${x}`)));

    [4,5,6,7].forEach((x) => colorAllVertices(flownetworkSVGDocuments.get(`flownetwork-${x}`)));

    addToggleColorEventListenerToEdges(getEdges(flownetworkSVGDocuments.get("flownetwork-7")));
    colorDiscoveredVertices(flownetworkSVGDocuments.get("bfs-2"));
    addToggleColorEventListenerToEdges(getEdges(flownetworkSVGDocuments.get("bfs-2")));
    addToggleColorEventListenerToVertices(getColoredVertices(flownetworkSVGDocuments.get("bfs-2")));

    const flownetwork7PathOutput = document.getElementById("flownetwork-7-path");
    const flownetwork7Path = ["R", "K", "S", "Z"];
    let flownetwork7PathPos = 0;
    getEdges(flownetworkSVGDocuments.get("flownetwork-7")).forEach((edge) => {
        edge.arrowHead.addEventListener("click", () => addFakePath());
        edge.line.addEventListener("click", () => addFakePath());

        const addFakePath = () => {
            const vertexLabel = flownetwork7Path[flownetwork7PathPos];
            if (vertexLabel) {
                flownetwork7PathOutput.innerText += `, ${flownetwork7Path[flownetwork7PathPos]}`;
                flownetwork7PathPos++;
            }
        }
    });
}

const prepareBreadthFirstSearchSlides = () => {
    const breadthFirstSearchSVGPaths = getBreadthFirstSearchSVGPaths();
    
    const breadthFirstSearchDemo = document.getElementById("bfs-demo");
    breadthFirstSearchSVGPaths.forEach((breadthFirstSearchSVGPath) => {
        breadthFirstSearchSVGPath.svg.hidden = true;
        breadthFirstSearchDemo.appendChild(breadthFirstSearchSVGPath.svg);
    });

    const queueContainer = document.getElementById("queue");
    const discoveredContainer = document.getElementById("discovered");
    let breadthFirstSearchSVGPos = 0;

    const nextBFSAnimationButton = document.getElementById("nextBFSAnimationButton");

    nextBFSAnimationButton.addEventListener("click", () => {
        nextBFSAnimation(
            queueContainer,
            discoveredContainer,
            breadthFirstSearchDemo,
            breadthFirstSearchSVGPaths,
            breadthFirstSearchSVGPos);
        
        breadthFirstSearchSVGPos++;
    });
}

// Functions

const getFlownetworkSVGDocuments = () => {
    const flownetworkSVGs = document.getElementsByClassName("flownetwork");
    /**@type {Map<string, XMLDocument>}*/
    const flownetworkSVGDocuments = new Map();
    for (let i = 0; i < flownetworkSVGs.length; i++) {
        flownetworkSVGDocuments.set(flownetworkSVGs[i].id, flownetworkSVGs[i].contentDocument);
    }

    return flownetworkSVGDocuments;
}

const colorFlownetworks = (
    /**@type {Map<string, XMLDocument>}*/ flownetworkSVGDocuments
) => {
    flownetworkSVGDocuments.forEach((flownetworkSVGDocument) => colorFlownetwork(flownetworkSVGDocument));
}

const colorFlownetwork = (
    /**@type {XMLDocument}*/ flownetworkSVGDocument
) => {
    const g = flownetworkSVGDocument.getElementsByTagName("g")
    for (let i = 0; i < g.length; i++) {
        g[i].childNodes.forEach((childNode) => {
            childNode.setAttribute("stroke", styles.mainColor);
        });
    }
}

const colorText = (
    /**@type {XMLDocument}*/ graphic
) => {
    const texts = graphic.querySelectorAll("switch div div div")
    for(let i = 0; i < texts.length; i++) {
        texts[i].style.color = styles.linkColor;
        texts[i].style.fontSize = "36px";
        texts[i].style.fontWeight = "bold";
    }
}

const colorSourceVertex = (
    /**@type {XMLDocument}*/ graphic
) => {
    const source = graphic.getElementsByTagName("ellipse")[0];
    source.setAttribute("stroke", styles.linkColor);
}

const colorTargetVertex = (
    /**@type {XMLDocument}*/ graphic
) => {
    const target = graphic.querySelector("[cx='1357']");
    target.setAttribute("stroke", styles.linkColor);
}

const getVertices = (
    /**@type {XMLDocument}*/ graphic
) => {
    const vertices = graphic.getElementsByTagName("ellipse");
    return vertices;
}

const colorAllVertices = (
    /**@type {XMLDocument}*/ graphic
) => {
    const vertices = getVertices(graphic);
    for (let i = 0; i < vertices.length; i++) {
        vertices[i].setAttribute("stroke", styles.linkColor);
    }
}

const disableFontStyles = (
    /**@type {XMLDocument}*/ graphic
) => {
    const fonts = graphic.getElementsByTagName("font");
    for (let i = 0; i < fonts.length; i++) {
        fonts[i].style = "";
    }
}

const getEdges = (
    /**@type {XMLDocument}*/ graphic
) => {
    const paths = graphic.getElementsByTagName("path");
    /**@type {{arrowHead: SVGPathElement, line: SVGPathElement, isColored: boolean}[]}*/
    const edges = [];
    for (let i = 1; i < paths.length; i += 2) {
        const edge = {
            arrowHead: paths[i],
            line: paths[i-1],
            isColored: false,
        };
        
        edges.push(edge);
    }

    return edges;
}

const getColoredVertices = (
    /**@type {XMLDocument}*/ graphic
) => {
    const ellipses = graphic.getElementsByTagName("ellipse");
    /**@type {{line: SVGPathElement, isColored: boolean, color: string}[]}*/
    const vertices = [];
    for (let i = 0; i < ellipses.length; i++) {
        const vertex = {
            line: ellipses[i],
            isColored: false,
            color: ellipses[i].getAttribute("stroke")
        };
        
        vertices.push(vertex);
    }

    return vertices;
}

const addToggleColorEventListenerToEdges = (
    /** @type {{arrowHead: SVGPathElement,line: SVGPathElement,isColored: boolean}[]}*/
    edges) => {
    edges.forEach((edge) => {
        const toggleEdgeColor = (
            /** @type {{arrowHead: SVGPathElement, line: SVGPathElement, isColored: boolean}} */
            edge
        ) => {
            if (edge.isColored) {
                edge.arrowHead.setAttribute("stroke", "#FFF");
                edge.line.setAttribute("stroke", "#FFF");
            } else {
                edge.arrowHead.setAttribute("stroke", "#0F0");
                edge.line.setAttribute("stroke", "#0F0");
            }

            edge.isColored = !edge.isColored;
        }

        edge.arrowHead.style.cursor = "pointer";
        edge.line.style.cursor = "pointer";

        edge.arrowHead.addEventListener("click", () => toggleEdgeColor(edge));
        edge.line.addEventListener("click", () => toggleEdgeColor(edge));
    });
}

const addToggleColorEventListenerToVertices = (
    /** @type {{line: SVGPathElement, isColored: boolean, color: string}[]}*/
    vertices) => {
        vertices.forEach((vertex) => {
        const toggleEdgeColor = (
            /** @type {{line: SVGPathElement, isColored: boolean, color: string}} */
            vertex
        ) => {
            if (vertex.isColored) {
                vertex.line.setAttribute("stroke", vertex.color);
            } else {
                vertex.line.setAttribute("stroke", "#0F0");
            }

            vertex.isColored = !vertex.isColored;
        }

        vertex.line.style.cursor = "pointer";

        vertex.line.addEventListener("click", () => toggleEdgeColor(vertex));
    });
}

const colorDiscoveredVertices = (
    /**@type {XMLDocument}*/ graphic
) => {
    const vertices = graphic.querySelectorAll("ellipse[stroke-width='16']");
    for (let i = 0; i < vertices.length; i++) {
        vertices[i].setAttribute("stroke", styles.linkColor);
    }
}

const addElementsToContainer = (
    /** @type {string[]}*/ elementNames,
    /** @type {HTMLElement}*/ container
) => {
    elementNames.forEach((elementName) => {
        const element = document.createElement("div");
        element.classList.add("queue-element");
        element.innerText = elementName;

        container.appendChild(element);
    });
}

const prepareBFSGraphic = (
    /** @type {number}*/ number
) => {
    const graphic = document.createElement("object");
    graphic.setAttribute("data", `./assets/breitensuche-${number}.svg`)
    graphic.classList.add("flownetwork");
    graphic.id = `bfs-${number}`
    graphic.width = "800";
    graphic.addEventListener("load", () => {
        const g = graphic.contentDocument.getElementsByTagName("g");
        for (let i = 0; i < g.length; i++) {
            g[i].childNodes.forEach((childNode) => {
                childNode.setAttribute("stroke", styles.mainColor);
            });
        }

        colorText(graphic.contentDocument);
        disableFontStyles(graphic.contentDocument);
        colorDiscoveredVertices(graphic.contentDocument);
        addToggleColorEventListenerToEdges(getEdges(graphic.contentDocument));
        addToggleColorEventListenerToVertices(getColoredVertices(graphic.contentDocument));
    });

    return graphic;
}

const nextBFSAnimation = (
    /** @type {HTMLElement}*/
    queueContainer,
    /** @type {HTMLElement}*/
    discoveredContainer,
    /** @type {HTMLElement}*/
    breadthFirstSearchDemo,
    /** @type {{svg: HTMLObjectElement, queueElements: string[], discoveredElements: string[]}[]}*/
    breadthFirstSearchSVGPaths,
    /** @type {number}*/
    breadthFirstSearchSVGPos
) => {
    const graphics = breadthFirstSearchDemo.getElementsByTagName("object");
    const currentGraphic = graphics[breadthFirstSearchSVGPos];
    const nextGraphic = graphics[breadthFirstSearchSVGPos+1];

    if (!nextGraphic) return;

    currentGraphic.hidden = true;
    nextGraphic.hidden = false;

    const firstElement = queueContainer.getElementsByClassName("queue-element")[0]
    firstElement.classList.remove("queue-element");
    firstElement.classList.add("removed-queue-element");

    addElementsToContainer(
        breadthFirstSearchSVGPaths[breadthFirstSearchSVGPos].queueElements,
        queueContainer
    );

    addElementsToContainer(
        breadthFirstSearchSVGPaths[breadthFirstSearchSVGPos].discoveredElements,
        discoveredContainer
    );
}

const getBreadthFirstSearchSVGPaths = () => {
    const breadthFirstSearchSVGPaths = [
        {
            svg: prepareBFSGraphic(3),
            queueElements: ["R", "G1"],
            discoveredElements: ["R", "G1"],
        },
        {
            svg: prepareBFSGraphic(4),
            queueElements: ["K"],
            discoveredElements: ["K"],
        },
        {
            svg: prepareBFSGraphic(5),
            queueElements: ["G2", "H"],
            discoveredElements: ["G2", "H"],
        },
        {
            svg: prepareBFSGraphic(6),
            queueElements: ["S"],
            discoveredElements: ["S"],
        },
        {
            svg: prepareBFSGraphic(6),
            queueElements: [],
            discoveredElements: [],
        },
        {
            svg: prepareBFSGraphic(7),
            queueElements: ["Z"],
            discoveredElements: ["Z"],
        },
        {
            svg: prepareBFSGraphic(7),
            queueElements: [],
            discoveredElements: [],
        },
        {
            svg: prepareBFSGraphic(7),
            queueElements: [],
            discoveredElements: [],
        },
    ];

    return breadthFirstSearchSVGPaths;
}