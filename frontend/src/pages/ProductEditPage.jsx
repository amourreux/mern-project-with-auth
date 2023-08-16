import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useCreateMovementMutation,
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from '../store/slices/productsApiSlice';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

const ProductEditPage = () => {
  const { id: productId } = useParams();

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [movements, setMovements] = useState([]);

  const [movDescription, setMovDescription] = useState('');
  const [inOrOutCount, setInOrOutCount] = useState(0);

  const [createMovement] = useCreateMovementMutation();

  const createMovementHandler = async () => {
    try {
      await createMovement({
        productId,
        description: movDescription,
        inOrOutCount,
      }).unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setMovDescription('');
    setInOrOutCount('');
  };

  const handleShow = () => {
    setShowModal(true);
    setMovDescription('');
    setInOrOutCount('');
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCode(product.code);
      setDescription(product.description);
      setCountInStock(product.countInStock);
      setMovements(product.movements);
    }
  }, [product]);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        description,
        code,
        countInStock,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Product updated');
      refetch();
      navigate('/products');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/products' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Alert variant='danger'>{error.data.message}</Alert>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='code'>
              <Form.Label>Code</Form.Label>
              <Form.Control
                type='code'
                placeholder='Enter code'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                readOnly
                type='number'
                min={0}
                value={countInStock}
              ></Form.Control>
            </Form.Group>
            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
      <hr></hr>
      <Button
        onClick={handleShow}
        type='button'
        variant='secondary'
        style={{ marginTop: '1rem' }}
      >
        Add Movement
      </Button>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Movement Description</th>
            <th>Change in stock</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((move, index) => (
            <tr key={move._id}>
              <td>{index + 1}</td>
              <td>{move.description}</td>
              <td>{move.inOrOutCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add stock movement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId='movement.inOrOutCount'>
              <Form.Label>In/Out</Form.Label>
              <Form.Control
                defaultValue={inOrOutCount}
                onChange={(e) => setInOrOutCount(e.target.value)}
                type='number'
                min={-countInStock}
                autoFocus
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='movement.description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                defaultValue={movDescription}
                onChange={(e) => setMovDescription(e.target.value)}
                as='textarea'
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='primary' onClick={createMovementHandler}>
            Add Movement
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ProductEditPage;
