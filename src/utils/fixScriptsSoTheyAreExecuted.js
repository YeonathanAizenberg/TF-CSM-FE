// When you render the html, the <script> tags dosent run. This code is running the <script> tags. We are doing that to insert the CurrentConfig on the windonw obj, for the case when we have an Item with '{}' as data comming from the DB
const fixScriptsSoTheyAreExecuted = (el) => {
  const scripts = el.tagName.toLowerCase() === "script" ? [el] : el.querySelectorAll("script")

  scripts.forEach((script)=>{
    const fixedScript = document.createElement("script");
    fixedScript.type = script.type;
    if (script.innerHTML) {
      fixedScript.innerHTML = script.innerHTML;
    }
    else {
      fixedScript.src = script.src;
    }
    fixedScript.async = false;

    script.parentNode.replaceChild(fixedScript, script);
  })
};

export default fixScriptsSoTheyAreExecuted;