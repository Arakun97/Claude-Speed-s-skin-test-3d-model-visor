let scene, camera, renderer, controls, model;

init();

function init() {
  scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(window.innerWidth, 500);
            document.getElementById("viewer").appendChild(renderer.domElement);

              controls = new THREE.OrbitControls(camera, renderer.domElement);

                const light = new THREE.HemisphereLight(0xffffff, 0x444444);
                  scene.add(light);

                    const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('model/');
mtlLoader.load('claude.mtl', function(materials) {
  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('model/');
  objLoader.load('claude.obj', function(obj) {
    model = obj;
    scene.add(model);
  });
});

                                      animate();
                                      }

                                      function animate() {
                                        requestAnimationFrame(animate);
                                          renderer.render(scene, camera);
                                            controls.update();
                                            }

                                            document.getElementById("fileInput").addEventListener("change", function () {
                                              const file = this.files[0];
                                                if (!file || !file.name.toLowerCase().endsWith('.bmp')) {
                                                    alert("Error: Only .bmp files are allowed ");
                                                        return;
                                                          }

                                                            const reader = new FileReader();
                                                              reader.onload = function (e) {
                                                                  const bmpData = BmpReader.decode(new Uint8Array(e.target.result));
                                                                      if (bmpData.width !== 256 || bmpData.height !== 256) {
                                                                            alert("Error: The resolution must be exactly 256x256 pixels");
                                                                                  return;
                                                                                      }

                                                                                          const canvas = document.createElement("canvas");
                                                                                              canvas.width = 256;
                                                                                                  canvas.height = 256;
                                                                                                      const ctx = canvas.getContext("2d");
                                                                                                          const imageData = ctx.createImageData(256, 256);
                                                                                                              imageData.data.set(bmpData.data);
                                                                                                                  ctx.putImageData(imageData, 0, 0);

                                                                                                                      const texture = new THREE.CanvasTexture(canvas);
                                                                                                                          if (model) {
                                                                                                                                model.material.map = texture;
                                                                                                                                      model.material.needsUpdate = true;
                                                                                                                                          }
                                                                                                                                            };
                                                                                                                                              reader.readAsArrayBuffer(file);
                                                                                                                                              });
