/* eslint-disable react/prop-types */
function CardLogin({ children }) {
  return (
    <div className="container h-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col col-md-6">
          <div className="card mb-3 shadow-sm text-center">
            <div className="row g-0">
              <div className="col-md-6 d-flex align-items-center justify-content-center">
                <img src="https://sun9-13.userapi.com/impg/qxiJUmiKN2yz3jEW03gdXqyq2-0i_ePOoHbl2A/MDxst8Hb2tk.jpg?size=200x200&quality=95&sign=780dae9705ad31218ba234936bfb20f6&type=album" className="img-fluid rounded-circle" alt="..." />
              </div>
              <div className="col-md-6 p-3">
                <div className="card-body">
                  <h1 className="card-title justify-content-center mb-3">Войти</h1>
                  {children}
                </div>
              </div>
            </div>
            <div className="card-footer text-body-secondary p-3">
              Нет аккаунта?
              {' '}
              <a href="/signup">Регистрация</a>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default CardLogin;
