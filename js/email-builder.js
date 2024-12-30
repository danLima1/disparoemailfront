const { DragDropContext, Droppable, Draggable } = window.ReactBeautifulDnd;
const styled = window.styled;

// Styled Components
const Container = styled.div`
    display: flex;
    gap: 20px;
    min-height: 600px;
`;

const Sidebar = styled.div`
    width: 300px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    h3 {
        color: white;
        margin-bottom: 20px;
        font-size: 1.2em;
    }
`;

const Canvas = styled.div`
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-height: 800px;

    h2 {
        color: white;
        margin-bottom: 20px;
    }
`;

const DraggableElement = styled.div`
    padding: 12px;
    margin: 8px 0;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    cursor: pointer;
    color: white;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
    }
`;

const EmailElement = styled.div`
    margin: 8px 0;
    padding: 15px;
    background: ${props => props.isDragging ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: white;
    transition: background-color 0.3s ease;

    h2, p, button {
        margin: 0;
        color: white;
    }

    img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
    }

    button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background: #45a049;
        }
    }
`;

// Componentes disponíveis para arrastar
const availableComponents = [
    { id: 'header', type: 'header', label: 'Cabeçalho' },
    { id: 'text', type: 'text', label: 'Texto' },
    { id: 'image', type: 'image', label: 'Imagem' },
    { id: 'button', type: 'button', label: 'Botão' },
    { id: 'spacer', type: 'spacer', label: 'Espaçador' },
];

function EmailBuilder() {
    const [elements, setElements] = React.useState([]);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Se não houver destino válido, não fazer nada
        if (!destination) return;

        // Se for um novo elemento do sidebar
        if (source.droppableId === 'sidebar') {
            const component = availableComponents.find(c => c.id === result.draggableId);
            const newElement = {
                id: `${component.type}-${Date.now()}`,
                type: component.type,
                content: getDefaultContent(component.type)
            };
            
            const newElements = Array.from(elements);
            newElements.splice(destination.index, 0, newElement);
            setElements(newElements);
        } else {
            // Reordenando elementos existentes
            const newElements = Array.from(elements);
            const [removed] = newElements.splice(source.index, 1);
            newElements.splice(destination.index, 0, removed);
            setElements(newElements);
        }
    };

    const getDefaultContent = (type) => {
        switch (type) {
            case 'header':
                return 'Novo Cabeçalho';
            case 'text':
                return 'Digite seu texto aqui';
            case 'button':
                return 'Clique Aqui';
            case 'image':
                return 'https://via.placeholder.com/300x200';
            case 'spacer':
                return '20px';
            default:
                return '';
        }
    };

    const renderElement = (element) => {
        switch (element.type) {
            case 'header':
                return <h2>{element.content}</h2>;
            case 'text':
                return <p>{element.content}</p>;
            case 'button':
                return <button className="btn">{element.content}</button>;
            case 'image':
                return <img src={element.content} alt="Email content" style={{maxWidth: '100%'}} />;
            case 'spacer':
                return <div style={{height: element.content}}></div>;
            default:
                return null;
        }
    };

    return (
        <Container>
            <DragDropContext onDragEnd={onDragEnd}>
                <Sidebar>
                    <h3>Componentes</h3>
                    <Droppable droppableId="sidebar" isDropDisabled={true}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {availableComponents.map((component, index) => (
                                    <Draggable
                                        key={component.id}
                                        draggableId={component.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <DraggableElement
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {component.label}
                                            </DraggableElement>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Sidebar>

                <Canvas>
                    <h2>Área de Edição</h2>
                    <Droppable droppableId="canvas">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {elements.map((element, index) => (
                                    <Draggable
                                        key={element.id}
                                        draggableId={element.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <EmailElement
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                isDragging={snapshot.isDragging}
                                            >
                                                {renderElement(element)}
                                            </EmailElement>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Canvas>
            </DragDropContext>
        </Container>
    );
}

ReactDOM.render(<EmailBuilder />, document.getElementById('root'));
