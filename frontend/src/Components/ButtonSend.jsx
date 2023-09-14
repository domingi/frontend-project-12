/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { NetStatusContext } from '../contexts';

export default function ButtonSend() {
  const net = useContext(NetStatusContext);
  switch (net.status) {
    case true:
      return (
        <Button type="submit" variant="outline-secondary" id="button-addon2">
          <i className="bi bi-arrow-right-square" />
        </Button>
      );
    case false:
      return (
        <button className="btn btn-outline-secondary" type="button" disabled>
          <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />
          <span role="status">Loading...</span>
        </button>
      );
    default:
      return null;
  }
}
