import { swapHTMLNodes, swapIDsLocationInArray } from "./utils";

const blocksOrder = {};

export function init() {
    const areas = document.getElementById("areas").children;

    const draggableBlocks = [];

    for (const area of areas) {
        const areaID = area.id;

        if (!areaID) return;

        blocksOrder[areaID] = [];

        const blocks = area.children;

        for (const block of blocks) {
            const isDraggable = block.attributes.draggable?.value;
            const isDraggableValid = isDraggable === "true";

            const id = block.attributes.id?.value;
            const isIDValid = id && id.length > 0;

            if (isIDValid) {
                blocksOrder[areaID].push(id);
            }

            if (isIDValid && isDraggableValid) {
                draggableBlocks.push(block);
            }
        }
    }

    draggableBlocks.forEach((draggableBlock) => {
        //draggable event listeners
        draggableBlock.addEventListener("dragstart", dragStart);
        //droppable event listeners
        draggableBlock.addEventListener("dragover", dragOver);
        draggableBlock.addEventListener("drop", drop);
    });
}

function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function dragOver(event) {
    event.preventDefault(); //allows drop
}

function drop(event) {
    event.preventDefault(); //prevents default drop behavior: to open the link of the dragged element
    const srcElementID = event.dataTransfer.getData("text/plain"); //get the id of the dragged element
    const targetElementID = event.target?.id; //get the id of the dropped element
    const srcElement = document.getElementById(srcElementID);
    const targetElement = event.target;
    if (srcElement && targetElement) {
        const srcAreaID = srcElement.parentElement?.id;
        const targetAreaID = targetElement.parentElement?.id;

        if (srcAreaID === targetAreaID) {
            swapHTMLNodes(srcElement, targetElement);
            swapIDsLocationInArray(srcElementID, targetElementID, blocksOrder[srcAreaID]);

            localStorage.setItem("blocksOrder", JSON.stringify(blocksOrder)); //need to be replaced by an API call. We want to update the database with the new order

        }
    } else {
        console.log("srcElement or targetElement is null");
    }
}
