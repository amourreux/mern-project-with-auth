import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Alert, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../store/slices/productsApiSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';

const ProductsPage = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const [show, setShow] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const handleShow = () => setShow(true);
  const handleCloseModal = () => {
    setShow(false);
    setName('');
    setCode('');
    setDescription('');
    setCountInStock(0);
  };

  const isReady = !isLoading && !error;

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    try {
      await createProduct({
        name,
        description,
        code,
        countInStock,
      }).unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={handleShow}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading && <Loader />}
      {error && <Alert variant='danger'>{error.data.message}</Alert>}

      {isReady && (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Code</th>
              <th>Count In Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.code}</td>
                <td>{product.countInStock}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm mx-2'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(product._id)}
                  >
                    <FaTrash style={{ color: 'white' }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {isReady && <Paginate pages={data.pages} page={data.page} />}

      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId='product.name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='product.code'>
              <Form.Label>Code</Form.Label>
              <Form.Control
                type='name'
                defaultValue={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='Enter code'
                autoFocus
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='product.name'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                min='0'
                autoFocus
                readOnly
                defaultValue={countInStock}
                placeholder='Enter Current Stock'
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='exampleForm.description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter description'
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant='primary' onClick={createProductHandler}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductsPage;
