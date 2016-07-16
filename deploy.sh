set -euf -o pipefail

S3_BUCKET_NAME='osrs-lightbox-solver.fletom.com'
EXCLUDE=('.DS_Store' 'deploy.sh' '.git/*')

exclude_params=''
for e in ${EXCLUDE[@]}; do
	exclude_params="$exclude_params --exclude $e"
done

aws s3 sync \
	./ s3://$S3_BUCKET_NAME \
	--acl 'public-read' \
	$exclude_params \
	--delete
