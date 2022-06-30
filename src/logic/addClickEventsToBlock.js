
const addClickEventsToBlock = (area, eventOne) => {
    const areaBlocks = area.children
    for (const block of areaBlocks) {
        block.addEventListener("click", eventOne);
        for (const child of block.children) {
            child.addEventListener("click", eventOne);
        }
    }
}

export default addClickEventsToBlock