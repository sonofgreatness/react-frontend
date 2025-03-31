import { Modal, Button, Form } from 'react-bootstrap';

const RemarkModal = ({ show, onHide, onSave, xDatapoint }) => {
  const [place, setPlace] = useState('');
  const [remark, setRemark] = useState('');

  const handleSave = () => {
    const fullRemark = `${place}, ${remark}`;
    onSave(xDatapoint, fullRemark);
    setPlace('');
    setRemark('');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Remark</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Place</Form.Label>
            <Form.Control type="text" value={place} onChange={(e) => setPlace(e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Remark</Form.Label>
            <Form.Control type="text" value={remark} onChange={(e) => setRemark(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemarkModal;
