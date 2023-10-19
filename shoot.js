AFRAME.registerComponent("paint", {
    init: function () {
      this.shootPaint();
    },
    shootPaint: function () {
      window.addEventListener("keydown", (e) => {
        if (e.key === "z") {
          var paint = document.createElement("a-entity");
  
          paint.setAttribute("geometry", {
            primitive: "sphere",
            radius: 1,
          });
  
          paint.setAttribute("material", "color", "black");
  
          var cam = document.querySelector("#camera-rig");
  
          pos = cam.getAttribute("position");
  
          paint.setAttribute("position", {
            x: pos.x,
            y: pos.y+1,
            z: pos.z-0.5,
          });
  
          var camera = document.querySelector("#camera").object3D;
  
          //get the camera direction as Three.js Vector
          var direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
  
          //set the velocity and it's direction
          paint.setAttribute("velocity", direction.multiplyScalar(-10));
  
          var scene = document.querySelector("#scene");
  
          //set the paint as the dynamic entity
          paint.setAttribute("dynamic-body", {
            shape: "sphere",
            mass: "0",
          });
  
          //add the collide event listener to the paint
          paint.addEventListener("collide", this.removePaint);
  
          scene.appendChild(paint);
  
        }
      });
    },
    removePaint: function (e) {
      //paint element
      var element = e.detail.target.el;
  
      //element which is hit
      var elementHit = e.detail.body.el;
  
      if (elementHit.id.includes("wall")) {
        elementHit.setAttribute("material", {
          opacity: 1,
          transparent: true,
        });
  
        //impulse and point vector
        var impulse = new CANNON.Vec3(-2, 2, 1);
        var worldPoint = new CANNON.Vec3().copy(
          elementHit.getAttribute("position")
        );
  
        elementHit.body.applyImpulse(impulse, worldPoint);
  
        //remove event listener
        element.removeEventListener("collide", this.removePaint);
  
        //remove the paintballs from the scene
        var scene = document.querySelector("#scene");
        scene.removeChild(element);
      }
    },
  });
  
  