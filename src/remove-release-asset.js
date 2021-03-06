"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
            const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
            const { owner, repo } = github.context.repo;
            // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
            const releaseId = parseInt(core.getInput('release_id', { required: true }));
            const assetName = core.getInput('asset_name', { required: true });
            const { data: assets } = yield octokit.rest.repos.listReleaseAssets({
                owner: owner,
                repo: repo,
                release_id: releaseId
            });
            assets
                .filter(asset => asset.name === assetName)
                .forEach((asset) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield octokit.rest.repos.deleteReleaseAsset({ owner, repo, asset_id: asset.id });
                }
                catch (error) {
                    core.warning(`Caught ${error}`);
                }
            }));
        }
        catch (error) {
            core.setFailed((_a = error.message) !== null && _a !== void 0 ? _a : error);
        }
    });
}
exports.run = run;
