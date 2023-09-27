import React, { useState, useEffect } from 'react';

const ModalEditProduct = ({ isOpen, onClose, productToEdit, handleEdit, categorias }) => {
  const initialProduct = productToEdit ? productToEdit : {
    pro_nombre: "",
    pro_precio: 0,
    pro_stock: 0,
    pro_descripcion: "",
    pro_categoria: "",
  };

  const [editedProduct, setEditedProduct] = useState(initialProduct);

  useEffect(() => {
    // Cuando productToEdit cambia, actualiza el estado del modal
    if (productToEdit) {
      setEditedProduct(productToEdit);
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const onSave = (e) => {
    e.preventDefault();
    handleEdit(editedProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-product">
        <div className='form-container'>
          <form className='modal-form' onSubmit={onSave}>
            <div className="form-group-pair">
              <div>
                <label htmlFor="pro_nombre">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="pro_nombre"
                  value={editedProduct.pro_nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="pro_precio">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  name="pro_precio"
                  value={editedProduct.pro_precio}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group-pair">
              <div>
                <label htmlFor="pro_stock">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  name="pro_stock"
                  value={editedProduct.pro_stock}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="pro_descripcion">Descripción</label>
                <textarea
                  className="form-control"
                  name="pro_descripcion"
                  value={editedProduct.pro_descripcion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='btn-add-container'>
              <label htmlFor="pro_categoria">Categoría:</label>
              <select
                id="pro_categoria"
                name="pro_categoria"
                value={editedProduct.pro_categoria}
                onChange={handleInputChange}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.cat_nombre}>
                    {categoria.cat_nombre}
                  </option>
                ))}
              </select>

              </div>
            <div className="form-group">
              <button type="submit" className="btn-save">Guardar</button>
            </div>
          </form>
        </div>
        <span className="modal-close-product" onClick={onClose}>
          &times;
        </span>
      </div>
    </div>
  );
};

export default ModalEditProduct;
