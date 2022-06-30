const scrollToSelectedBlock = (blockID) => {
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

export default scrollToSelectedBlock