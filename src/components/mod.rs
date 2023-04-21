pub mod admin;
pub mod create_token;
pub mod header;
pub mod main_body;
pub mod panel;
pub mod panel_nav;
pub mod project;
pub mod projects;
pub mod register;
pub mod token;
pub mod tokens;
pub mod alert_modal;
pub mod user;
pub mod activate_modal;
pub mod add_user;
pub mod create_project;
pub mod project_admin;
pub mod about;
pub mod footer;
pub mod imprint;

use cfg_if::cfg_if;

cfg_if! {
    if #[cfg(feature = "ssr")] {
        use leptos::ServerFn;
        use crate::app::GetUserInfo;

        pub fn register_server_functions() {
            _ = register::RegisterUser::register();
            _ = register::CheckActivated::register();
            _ = GetUserInfo::register();
            _ = create_token::CreateTokenServer::register();
            _ = tokens::GetTokens::register();
            _ = token::DeleteToken::register();
            _ = admin::GetUsers::register();
            _ = activate_modal::ActivateUser::register();
            _ = user::DeactivateUser::register();
            _ = add_user::AddUserProject::register();
            _ = user::RemoveUser::register();
            _ = create_project::CreateProjectRequest::register();
            _ = projects::AdminAllProjects::register();
        }

    }
}
