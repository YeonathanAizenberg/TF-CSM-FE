export function swapHTMLNodes(nodeA, nodeB) {
    const parentA = nodeA?.parentNode;
    const siblingA = nodeA?.nextSibling === nodeB ? nodeA : nodeA?.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
}

export function swapIDsLocationInArray(ID1, ID2, array) {
    const index1 = array.indexOf(ID1);
    const index2 = array.indexOf(ID2);

    array[index1] = ID2;
    array[index2] = ID1;
}
