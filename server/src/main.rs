use aruna_web_app::{utils::mail::MailClient, *};
use axum::{
    body::Body as AxumBody,
    extract::{FromRef, Path, RawQuery, State},
    http::{HeaderMap, Request},
    response::{IntoResponse, Response},
    routing::post,
    Router,
};
use fileserv::file_and_error_handler;
use leptos::*;
use leptos_axum::{generate_route_list, handle_server_fns_with_context, LeptosRoutes};

//use crate::routes::{callback, login, refresh};

pub mod fileserv;
pub mod oidc;
//pub mod routes;

async fn server_fn_handler(
    State(app_state): State<ServerState>,
    path: Path<String>,
    headers: HeaderMap,
    raw_query: RawQuery,
    request: Request<AxumBody>,
) -> impl IntoResponse {
    handle_server_fns_with_context(
        path,
        headers,
        raw_query,
        move || {
            provide_context(app_state.mail.clone());
        },
        request,
    )
    .await
}

async fn leptos_routes_handler(
    State(app_state): State<ServerState>,
    req: Request<AxumBody>,
) -> Response {
    let handler = leptos_axum::render_app_to_stream_with_context(
        app_state.leptos_options.clone(),
        move || {
            provide_context(app_state.mail.clone());
        },
        || view! { <EntryPoint/> },
    );
    handler(req).await.into_response()
}

#[derive(FromRef, Clone)]
pub struct ServerState {
    //pub oidc: oidc::Authorizer,
    pub mail: aruna_web_app::utils::mail::MailClient,
    pub leptos_options: LeptosOptions,
}

#[tokio::main]
async fn main() {
    simple_logger::init_with_level(log::Level::Debug).expect("couldn't initialize logging");

    dotenvy::dotenv().expect("couldn't load .env file");

    let _key_cloak_url = std::env::var("KEYCLOAK_URL").expect("Keycloak URL must be set!");

    // Setting get_configuration(None) means we'll be using cargo-leptos's env values
    // For deployment these variables are:
    // <https://github.com/leptos-rs/start-axum#executing-a-server-on-a-remote-machine-without-the-toolchain>
    // Alternately a file can be specified such as Some("Cargo.toml")
    // The file would need to be included with the executable when moved to deployment
    let conf = get_configuration(None).await.unwrap();
    let leptos_options = conf.leptos_options;
    let server_state = ServerState {
        mail: MailClient::new().expect("Failed to create mail client"),
        leptos_options: leptos_options.clone(),
    };
    let addr = leptos_options.site_addr;
    let routes = generate_route_list(|| view! { <EntryPoint/> }).await;

    // let cors = CorsLayer::new()
    //     // allow `GET` and `POST` when accessing the resource
    //     .allow_methods([Method::GET, Method::POST])
    //     // allow requests from any origin
    //     .allow_origin(Any);

    // build our application with a route
    let app = Router::new()
        .route(
            "/api/*fn_name",
            post(server_fn_handler).get(server_fn_handler),
        )
        // .route("/login", get(login))
        // .route("/callback", get(callback))
        // .route("/oidc-callback", get(callback))
        // .route("/refresh", get(refresh))
        .leptos_routes_with_handler(routes, leptos_routes_handler)
        .fallback(file_and_error_handler)
        .with_state(server_state);

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    log!("listening on http://{}", &addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
