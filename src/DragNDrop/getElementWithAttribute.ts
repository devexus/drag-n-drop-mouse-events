const getElementWithAttribute = (child: HTMLElement, attribute: string) => {
  let parent = child.parentElement;

  if (child.hasAttribute(attribute)) {
    return child;
  }

  while (parent) {
    if (parent.hasAttribute(attribute)) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
};

export default getElementWithAttribute;
