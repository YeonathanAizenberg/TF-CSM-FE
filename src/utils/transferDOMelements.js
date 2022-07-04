const transferDOMelements = (newParent, oldParent) => {
  while (oldParent.childNodes.length > 0) {
    newParent.appendChild(oldParent.childNodes[0]);
  }
};

export default transferDOMelements;
