export const scrollToselectedtBlock = (blockID) => {
    let currentBlock = document.getElementById(blockID);
    const currentlySelectedBlock = document.getElementsByClassName("currently-selected-block")

    if(currentlySelectedBlock.length > 0) {
        currentlySelectedBlock[0].classList.remove("currently-selected-block");
        currentBlock.classList.add("currently-selected-block");
        currentBlock.scrollIntoView({behavior: "smooth", block: "center"})
    } else {
        currentBlock.classList.add("currently-selected-block");
        currentBlock.scrollIntoView({behavior: "smooth", block: "center"})
    }
}

export const addEventListeners = (area, eventOne, eventTwo) => {
    const areaBlocks = area.children
    for (const blocks of areaBlocks) {
        blocks.addEventListener("click", eventOne);
    }

    // addEventListener to the BlockId children
    for (let i = 0; i < areaBlocks.length; i++) {
        for (let j = 0; j < areaBlocks[i].children.length; j++) {
            areaBlocks[i].children[j].addEventListener("click", eventTwo);
    }
}
}