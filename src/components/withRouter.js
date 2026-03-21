import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

/**
 * HOC: inject navigate, params, location vào props của class component
 * Dùng vì class component không thể dùng hooks trực tiếp
 */
function withRouter(Component) {
  return function Wrapper(props) {
    const navigate = useNavigate();
    const params   = useParams();
    const location = useLocation();
    return <Component {...props} navigate={navigate} params={params} location={location} />;
  };
}

export default withRouter;
