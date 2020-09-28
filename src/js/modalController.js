let modal = document.querySelector("#DeleteNodeModal");
let closeDeleteModalButton = document.querySelector("#CloseDeleteModalButton");
let deleteNodeButton = document.querySelector("#DeleteNodeButton");
let exitDeleteModalButton = document.querySelector("#ExitDeleteModalButton");
let closeCreateModalButton = document.querySelector("#CloseCreateModalButton");
let exitCreateModalButton = document.querySelector("#ExitCreateModalButton");
let createNodeSubmit = document.querySelector("#CreateNodeSubmit");
let {closeTimer} = window;
const config = { attributes: true, childList: false, subtree: false };

const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        if ((mutation.type === 'attributes') && (mutation.attributeName == 'class')) {
            if([...document.querySelector("#DeleteNodeModal").classList].includes("show")){
                closeTimer.start();
            }
        }
    }
};

const observer = new MutationObserver(callback);

observer.observe(modal, config);

deleteNodeButton.addEventListener("click",()=>{
    const {nodeToDelete} = window;
    jQuery.ajax({
        url: "http://testsolid/tree/delete",
        type: "POST",
        data: {id:nodeToDelete},
        dataType: "json",
        success: function(result) {
            if (result){ 
                TreeNode.deleteNode((+result["data"]["deletedId"]));
            }
            return false;
        }
    });
    
    window.nodeToDelete = null;
    closeTimer.stop();
    closeDeleteModalButton.click();
})

closeDeleteModalButton.addEventListener("click",()=>{
    closeTimer.stop();
})

exitDeleteModalButton.addEventListener("click",()=>{
    closeTimer.stop();
})

createNodeSubmit.addEventListener("click",()=>{
    const node_name = document.querySelector("#node-name");
    const node_name_feedback = document.querySelector("#node-name-feedback");
    
    const {value} = node_name;
    node_name.classList.remove("is-invalid");
    let hasError = false
    if(!!value){
        if(value.length > 100){
            node_name_feedback.innerText = "Name must be less then 100 characters";
            hasError = true;
        }
        if(!value.trim().length > 0){
            node_name_feedback.innerText = "Use characters other than whitespace";
            hasError = true;
        }
    }else{
        node_name_feedback.innerText = "Fill this field";
        hasError = true;
    }
    if(hasError){
        node_name.classList.add("is-invalid");
    }else{
        const {nodeToAddChildren} = window;

        jQuery.ajax({
            url: "http://testsolid/tree/insert",
            type: "POST",
            data: {name:value, parentId: nodeToAddChildren},
            dataType: "json",
            success: function(result) {
                if (result){ 
                    TreeNode.addNode(value, (+result['data']['createdId']),nodeToAddChildren);
					console.log(result);
                }
                return false;
            }
        });
        node_name.value="";
        closeCreateModalButton.click();
    }
})

closeCreateModalButton.addEventListener("click",()=>{
    window.nodeToAddChildren = null;
})

exitCreateModalButton.addEventListener("click",()=>{
    window.nodeToAddChildren = null;
})