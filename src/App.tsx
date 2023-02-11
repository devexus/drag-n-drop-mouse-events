import { useState } from "react";
import "./App.css";
import { DragDropContext } from "./DragNDrop/DragDropContext";
import Draggable from "./DragNDrop/Draggable";
import Droppable from "./DragNDrop/Droppable";

const DRAGGABLE_DATA = [
  {
    id: "draggable_1",
    name: "Reference one",
  },
  {
    id: "draggable_2",
    name: "Reference two",
  },
];

function App() {
  const [list] = useState(DRAGGABLE_DATA);
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="App">
      <div className="wrapper">
        <DragDropContext
          onDragEnd={(droppableId, draggableId) => {
            console.log("draggable", draggableId, "droppabled", droppableId);
          }}
        >
          <Droppable droppableId="droppable_1">
            {(isOver, ref, droppableProps) => {
              return (
                <div
                  ref={ref}
                  {...droppableProps}
                  className="droppable-area-2"
                  style={{
                    height: "200px",
                    border: isOver ? "dashed 1px #000" : undefined,
                  }}
                >
                  <span>Droppable area droppable_1</span>
                </div>
              );
            }}
          </Droppable>
          <Droppable droppableId="droppable_2">
            {(isOver, ref, droppableProps) => {
              return (
                <div
                  ref={ref}
                  {...droppableProps}
                  className="droppable-area-2"
                  style={{
                    height: "200px",
                    border: isOver ? "dashed 1px #000" : undefined,
                  }}
                >
                  <span>Droppable area droppable_2</span>
                </div>
              );
            }}
          </Droppable>
          <div className="spacer"></div>
          <div className="draggable-wrapper">
            {list.map((el) => {
              return (
                <Draggable
                  key={el.id}
                  draggableId={el.id}
                  renderClone={
                    <div className="bg-color">
                      {selected.length > 1 ? (
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            background: "green",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: "translateX(50%)",
                            color: "white",
                          }}
                        >
                          {selected.length}
                        </div>
                      ) : null}

                      <div style={{ display: "flex" }}>
                        <div>
                          <svg
                            focusable="false"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            data-testid="ImageIcon"
                            width={40}
                            height={40}
                          >
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
                          </svg>
                        </div>
                        <span>{el.name}</span>
                      </div>
                    </div>
                  }
                >
                  {(isDragging, ref) => {
                    return (
                      <div
                        ref={ref}
                        onClick={() => {
                          if (selected.includes(el.id)) {
                            setSelected((selected) => {
                              const index = selected.indexOf(el.id);
                              const array = [...selected];
                              array.splice(index, 1);
                              return array;
                            });
                            return;
                          }
                          setSelected((selected) => [...selected, el.id]);
                        }}
                        style={{
                          opacity:
                            isDragging || selected.includes(el.id) ? 0.5 : 1,
                          userSelect: "none",
                        }}
                      >
                        <span>Draggable {el.name}</span>
                        <img
                          src="https://dummyimage.com/333x400/000/fff"
                          style={{ width: "100%" }}
                        ></img>
                      </div>
                    );
                  }}
                </Draggable>
              );
            })}
          </div>
        </DragDropContext>
      </div>
      <div style={{ height: 2000 }}></div>
    </div>
  );
}

export default App;
